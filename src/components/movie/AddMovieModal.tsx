'use client'

import { useEffect, useMemo, useState } from 'react'
import { createMovie } from '@/services/movies'
import { createGenre, getGenres } from '@/services/genres'
import { uploadImageToBlob } from '@/services/imageUpload'
import { isTmdbImageUrl, isWebpOrJpgUrl } from '@/utils/tmdbImage'
import type { Genre, MovieCreateInput } from '@/types/movie'
import styles from './AddMovieModal.module.scss'

type AddMovieModalProps = {
  onClose: () => void
  onSuccess: () => void
}

const AddMovieModal = ({ onClose, onSuccess }: AddMovieModalProps) => {
  const [title, setTitle] = useState('')
  const [image, setImage] = useState('')
  const [year, setYear] = useState('')
  const [duration, setDuration] = useState('')
  const [genreId, setGenreId] = useState('')

  const [synopsis, setSynopsis] = useState('')
  const [director, setDirector] = useState('')
  const [language, setLanguage] = useState('')
  const [budget, setBudget] = useState('')
  const [showDetails, setShowDetails] = useState(false)

  const [genres, setGenres] = useState<Genre[] | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [newGenre, setNewGenre] = useState('')
  const [isAddingGenre, setIsAddingGenre] = useState(false)
  const [showGenreInput, setShowGenreInput] = useState(false)
  const [genreError, setGenreError] = useState<string | null>(null)

  useEffect(() => {
    getGenres()
      .then((genres) => {
        setGenres(genres)
      })
      .catch(() => {
        setGenres([])
      })
  }, [])

  const close = () => {
    setError(null)
    onClose()
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setError(null)
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const hasDetailInput = useMemo(
    () =>
      synopsis.trim().length > 0 ||
      director.trim().length > 0 ||
      language.trim().length > 0 ||
      budget.trim() !== '',
    [synopsis, director, language, budget],
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    const imageValue = image.trim()

    const isTmdbPoster =
      !!imageValue && isTmdbImageUrl(imageValue) && isWebpOrJpgUrl(imageValue)
    const shouldUploadToBlob =
      isTmdbPoster && process.env.NODE_ENV === 'production'

    const yearNum = Number(year)
    if (!Number.isInteger(yearNum) || yearNum < 1888 || yearNum > 2100) {
      setError('Year must be a whole number between 1888 and 2100')
      return
    }

    const durationNum = Number(duration)
    if (
      !Number.isInteger(durationNum) ||
      durationNum < 1 ||
      durationNum > 1000
    ) {
      setError('Duration must be between 1 and 1000 minutes')
      return
    }

    const genreNum = Number(genreId)
    if (!Number.isInteger(genreNum) || genreNum < 1) {
      setError('Please choose a genre')
      return
    }

    const budgetNum = budget.trim() === '' ? 0 : Number(budget)
    if (Number.isNaN(budgetNum) || budgetNum < 0) {
      setError('Budget must be a positive number')
      return
    }

    setIsSubmitting(true)
    try {
      let imageUrl = ''
      if (isTmdbPoster) {
        if (shouldUploadToBlob) {
          setIsUploadingImage(true)
          try {
            imageUrl = await uploadImageToBlob(imageValue)
          } finally {
            setIsUploadingImage(false)
          }
        } else {
          // Local dev: keep the TMDB URL directly, no blob upload.
          imageUrl = imageValue
        }
      }

      const input: MovieCreateInput = {
        title: title.trim(),
        image: imageUrl,
        year: yearNum,
        duration: durationNum,
        genreId: genreNum,
        ...(hasDetailInput
          ? {
              detail: {
                synopsis: synopsis.trim(),
                director: director.trim(),
                language: language.trim(),
                budget: budgetNum,
              },
            }
          : {}),
      }

      await createMovie(input)
      window.dispatchEvent(new Event('movies-updated'))
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create movie')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddGenre = async (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    e.preventDefault()
    setGenreError(null)

    const name = newGenre.trim()
    if (!name) {
      setGenreError('Genre name is required')
      return
    }

    const existing = genres?.find(
      (genre) => genre.name.toLowerCase() === name.toLowerCase(),
    )
    if (existing) {
      setGenreId(String(existing.id))
      setNewGenre('')
      setShowGenreInput(false)
      return
    }

    setIsAddingGenre(true)
    try {
      const created = await createGenre(name)
      setGenres((current) =>
        [...(current ?? []), created].sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
      )
      setGenreId(String(created.id))
      setNewGenre('')
      setShowGenreInput(false)
    } catch (err) {
      setGenreError(
        err instanceof Error ? err.message : 'Could not create genre',
      )
    } finally {
      setIsAddingGenre(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={close}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label="Add movie"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={close}
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className={styles.title}>Add movie</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span className={styles.labelText}>Title</span>
            <input
              className={styles.input}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Inception"
              required
            />
          </label>

          <label className={styles.field}>
            <span className={styles.labelText}>Image URL</span>
            <input
              className={styles.input}
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://image.tmdb.org/t/p/w600_and_h900_face/xxx.webp|jpg|jpeg"
            />
            <p className={styles.hint}>
              Only TMDB posters (image.tmdb.org/t/p/w600_and_h900_face, .webp |
              jpg | jpeg) are uploaded.
            </p>
          </label>

          <div className={styles.row}>
            <label className={styles.field}>
              <span className={styles.labelText}>Year</span>
              <input
                className={styles.input}
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min={1888}
                max={2100}
                placeholder="2010"
                required
              />
            </label>

            <label className={styles.field}>
              <span className={styles.labelText}>Duration (min)</span>
              <input
                className={styles.input}
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min={1}
                max={1000}
                placeholder="148"
                required
              />
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.labelText}>Genre</span>
            <select
              className={styles.input}
              value={genreId}
              onChange={(e) => setGenreId(e.target.value)}
              disabled={genres === null || genres.length === 0}
              required
            >
              <option value="">
                {genres === null
                  ? 'Loading genres…'
                  : genres.length === 0
                    ? 'No genres available'
                    : 'Choose a genre'}
              </option>
              {genres?.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </label>

          <div className={styles.genreAdd}>
            {showGenreInput ? (
              <div className={styles.genreAddForm}>
                <input
                  className={styles.genreAddInput}
                  type="text"
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddGenre(e)
                    }
                  }}
                  placeholder="e.g. Comedy"
                  aria-label="New genre name"
                  autoFocus
                />
                <button
                  type="submit"
                  className={styles.genreAddButton}
                  disabled={isAddingGenre}
                  onClick={(e) => handleAddGenre(e)}
                >
                  {isAddingGenre ? 'Adding…' : 'Add'}
                </button>
                <button
                  type="button"
                  className={styles.genreAddCancel}
                  onClick={() => {
                    setShowGenreInput(false)
                    setNewGenre('')
                    setGenreError(null)
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                className={styles.genreAddToggle}
                onClick={() => {
                  setShowGenreInput(true)
                  setGenreError(null)
                }}
              >
                + Can&apos;t find your genre? Add it
              </button>
            )}
            {genreError && <p className={styles.error}>{genreError}</p>}
          </div>

          <div className={styles.detailsToggleWrap}>
            <button
              type="button"
              className={styles.detailsToggle}
              aria-expanded={showDetails}
              onClick={() => setShowDetails((open) => !open)}
            >
              <span
                className={showDetails ? styles.arrowOpen : styles.arrowClosed}
                aria-hidden="true"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
              Details
            </button>
          </div>

          {showDetails && (
            <div className={styles.details}>
              <label className={styles.field}>
                <span className={styles.labelText}>Synopsis</span>
                <textarea
                  className={styles.textarea}
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  rows={4}
                  placeholder="A short summary of the movie…"
                />
              </label>

              <div className={styles.row}>
                <label className={styles.field}>
                  <span className={styles.labelText}>Director</span>
                  <input
                    className={styles.input}
                    type="text"
                    value={director}
                    onChange={(e) => setDirector(e.target.value)}
                    placeholder="Christopher Nolan"
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.labelText}>Language</span>
                  <input
                    className={styles.input}
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder="English"
                  />
                </label>
              </div>

              <label className={styles.field}>
                <span className={styles.labelText}>Budget ($)</span>
                <input
                  className={styles.input}
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  min={0}
                  step="0.01"
                  placeholder="160000000"
                />
              </label>
            </div>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <button
            type="submit"
            className={styles.submit}
            disabled={isSubmitting}
          >
            {isUploadingImage
              ? 'Uploading image…'
              : isSubmitting
                ? 'Adding…'
                : 'Add movie'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddMovieModal
