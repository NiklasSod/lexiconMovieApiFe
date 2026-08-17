export interface Actor {
  id: number
  name: string
  role: string
}

export interface Review {
  id: number
  reviewerName: string
  comment: string
  rating: number
  movieId: number
}

export interface MovieDetail {
  id: number
  synopsis: string
  director: string
  language: string
  budget: number
}

export interface MovieWithDetail {
  id: number
  title: string
  image: string
  year: number
  duration: number
  genreId: number
  genreName: string
  detail: MovieDetail
  actors: Actor[]
  reviews: Review[]
}
