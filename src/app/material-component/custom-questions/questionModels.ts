export class Question {
    public id: string | undefined;
    public text: string | undefined;
    public questionType: any = QuestionType.UNDEFINED;
    public questionTrueFalseStrategy: any = TrueFalseQuestionStrategy.UNDEFINED;
    public childQuestion: Question | undefined;
    public pointsPositive: any = 1;
    public pointsNegative: any = 0;
  
    constructor(id: string | undefined, text: string | undefined) {
      this.id = id;
      this.text = text;
    }
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

  export enum TrueFalseQuestionStrategy{
    UNDEFINED,
    SKIP_CHILD_IF_PARENT_IS_TRUE,
    SHOW_CHILD_IF_PARENT_IS_TRUE,
  }