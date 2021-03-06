/* eslint-disable no-useless-constructor */
import { LoadSurveys, SurveyModel, LoadSurveysRepository } from './db-load-surveys-protocols';

export class DbLoadSurveys implements LoadSurveys {
  constructor(private readonly loadSurveysRepository: LoadSurveysRepository) {}

  async load(accountId: string): Promise<LoadSurveys.Result> {
    const surveys = await this.loadSurveysRepository.loadAll(accountId);
    return surveys;
  }
}
