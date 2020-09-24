import { Question, TestResultModel, TrueFalseQuestionStrategy, AnswerTrueFalse } from './questionModels'

export enum QuestionWizardEngineState {
    STARTED = 'STARTED',
    FINISHED = 'FINISHED',
    IS_READY = 'IS_READY'
}


export class QuestionWizardEngine {

    public questions: Array<Question> = new Array<Question>();
    public testResultModels: Array<TestResultModel> = new Array<TestResultModel>();;
    public sequenceEngine: SequenceEngine<Question> = new SequenceEngine;

    public state: QuestionWizardEngineState = QuestionWizardEngineState.IS_READY;
    public currentQuestion: Question = new Question;
    public currentIndex: number = 0;
    public currentPoints: number = 0;

    public currentTestResult: TestResultModel | undefined;

    init(questions: Array<Question>, testResultModels: Array<TestResultModel>) {
        this.questions = questions;
        this.testResultModels = testResultModels;
        this.sequenceEngine = new SequenceEngine();
        this.sequenceEngine._items = questions;
        this.currentIndex = 0;
        this.currentPoints = 0;
    }

    setStateStart() {
        console.log("setStateStart")
        this.sequenceEngine.setStateStart();
        this.currentIndex = 0;
        this.currentPoints = 0;

        this.state = QuestionWizardEngineState.STARTED;
        this.currentQuestion = this.questions[this.sequenceEngine.index];

        this.currentTestResult = undefined;
    }

    next() {
        console.log(this.sequenceEngine.isFinished())
        if (this.sequenceEngine.isFinished()) {
            return;
        }
        this.calcPoints()

        let childQuestionPolicy = this.checkChildQuestion(this.currentQuestion);
        if (childQuestionPolicy.showChild) {
            this.currentQuestion = this.questions[this.sequenceEngine.index].childQuestion;
            return;
        }


        this.sequenceEngine.next();
        this.currentQuestion = this.questions[this.sequenceEngine.index];
        this.currentIndex = this.sequenceEngine.index;

        if (this.sequenceEngine.isFinished()) {
            this.state = QuestionWizardEngineState.FINISHED;

            this.handleTestResult();
            return;
        }
    }

    calcPoints() {
        if (this.currentQuestion)
            this.currentPoints += this.currentQuestion.getAnswerPoint();
        else {
            throw "CurrentQuestion is undefined";
        }
    }

    private checkChildQuestion(question: Question): any {
        let result = { showChild: false }

        if (!question.childQuestion)
            return result;

        if (question.childQuestion.questionTrueFalseStrategy == TrueFalseQuestionStrategy.SHOW_CHILD_IF_PARENT_IS_TRUE) {
            let parentAnswer = question.answerTrueFalse;
            if (parentAnswer == AnswerTrueFalse.TRUE) {
                result.showChild = true;
            } else {
                result.showChild = false;
            }
        }

        if (question.childQuestion.questionTrueFalseStrategy == TrueFalseQuestionStrategy.SKIP_CHILD_IF_PARENT_IS_TRUE) {
            let parentAnswer = question.answerTrueFalse;
            if (parentAnswer == AnswerTrueFalse.TRUE)
                result.showChild = false;
            else
                result.showChild = true;
        }

        return result;
    }

    handleTestResult() {
        this.currentTestResult = this.testResultModels.find(x => { return x.points == this.currentPoints });

        if (!this.currentTestResult) {
            this.currentTestResult = new TestResultModel();
            this.currentTestResult.message = "You haven`t specified this result!";
            this.currentTestResult.points = this.currentPoints;
        }

    }
}

export class SequenceEngine<T> {
    public _items: Array<T> = new Array<T>();

    private _currentIndex: number = 0;
    private _state: SequenceState = SequenceState.IS_READY_TO_START;

    public set items(items: Array<T>) {
        this._items = items;
    }

    public isFinished(): boolean {
        return this._state == SequenceState.IS_FINISHED;
    }

    public get index(): number {
        return this._currentIndex;
    }

    setStateStart() {
        this._currentIndex = 0;
        this._state = SequenceState.IS_IN_PROGRESS;
    }

    getCurrentItem(): T {
        return this.items[this._currentIndex];
    }

    public next() {
        this._currentIndex++;
        if (this._state === SequenceState.IS_FINISHED)
            return;

        if (this.checkReachSequenceEnd())
            return;
    }

    //Private 
    private checkReachSequenceEnd(): boolean {

        if (this._currentIndex === this._items.length) {
            this._state = SequenceState.IS_FINISHED;
            return true;
        } else {
            return false;
        }

    }
}

export enum SequenceState {
    IS_READY_TO_START,
    IS_IN_PROGRESS,
    IS_FINISHED
}