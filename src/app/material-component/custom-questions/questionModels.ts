export class Question {
  public id: string | undefined;
  public text: string | undefined;
  public questionType: any = QuestionType.UNDEFINED;
  public questionTrueFalseStrategy: any = TrueFalseQuestionStrategy.UNDEFINED;
  public childQuestion: Question | undefined;
  public pointsPositive: any = 1;
  public pointsNegative: any = 0;

  public answerTrueFalse: AnswerTrueFalse = AnswerTrueFalse.UNDEFINED;
  public inputAnswer: any;

  getAnswerPoint(): number {
    console.log("getAnswerPoint")
    console.log(this)

    if (this.questionType == QuestionType.TRUE_FALSE_QUESTION) {
      if (this.answerTrueFalse == AnswerTrueFalse.TRUE)
        return this.pointsPositive;
      if (this.answerTrueFalse == AnswerTrueFalse.FALSE)
        return this.pointsNegative;
    }

    if (this.questionType == QuestionType.INPUT_QUESTION) {
      return 0;
    }

    return 0;
  }

  public handleAnswer(answerTrueFalse: boolean = false, inputAnswer: any = false) {
    if (answerTrueFalse)
      this.answerTrueFalse = AnswerTrueFalse.TRUE
    else
      this.answerTrueFalse = AnswerTrueFalse.FALSE

      this.inputAnswer = inputAnswer;
  }

}

export enum AnswerTrueFalse {
  UNDEFINED,
  TRUE,
  FALSE
}


export class EditQuestionViewModel {
  public editQuestionMode: boolean = false;
  public addQuestionMode: boolean = false;
  public currentQuestion: Question | undefined;
}

export enum QuestionType {
  UNDEFINED,
  TRUE_FALSE_QUESTION,
  INPUT_QUESTION,
}

export enum TrueFalseQuestionStrategy {
  UNDEFINED,
  SKIP_CHILD_IF_PARENT_IS_TRUE,
  SHOW_CHILD_IF_PARENT_IS_TRUE,
}

export class TestResultModel {
  id: string = '';
  points: number = 0;
  message: string = '';
}

export class ResultHandler {
  questions: Array<Question> = new Array<Question>();
  resultsList: Array<TestResultModel> = new Array<TestResultModel>();

  calculateResult(): TestResultModel {
    return new TestResultModel();
  }

}




