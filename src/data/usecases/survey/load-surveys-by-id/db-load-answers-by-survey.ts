import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository';
import { LoadAnswersBySurvey } from '@/domain/usercases/survey/load-answers-by-survey';

export class DbLoadAnswersBySurvey implements LoadAnswersBySurvey {
  constructor(private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) {}

  async loadAnswers(id: string): Promise<LoadAnswersBySurvey.Reuslt> {
    const survey = await this.loadSurveyByIdRepository.loadById(id);
    return survey?.answers.map(answer => answer.answer) || [];
  }
}
