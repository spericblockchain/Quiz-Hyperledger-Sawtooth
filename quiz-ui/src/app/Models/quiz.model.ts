export interface QuizModel {
  question: string
  answer1: string
  answer2: string
  answer3: string
  answer4: string
  bestAnswer: string
  // batch: string
}

export interface PlayQuizList {
  quiz: PlayQuizModel[]
}
export interface PlayQuizModel {
  question: string
  answer1: string
  answer2: string
  answer3: string
  answer4: string
}
export interface QuizDataModel {
  id: any
  name: string
  batch: string
  hash: string
  address?: string
}
