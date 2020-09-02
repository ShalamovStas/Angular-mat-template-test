import { Question, TestResultModel } from './questionModels'


export class QuestionWizardEngine {

    public questions: Array<Question> = new Array<Question>();
    public testResultModels: Array<TestResultModel> =  new Array<TestResultModel>();;
    public sequenceEngine: SequenceEngine<Question> =  new SequenceEngine;

    public quizStarted: boolean = false; 
    public quizFinished: boolean = true; 
    public currentQuestion: Question = new Question; 
    public currentIndex: number = 0; 
    public currentPoints: number = 0; 

    // constructor(questions: Array<Question>, testResultModels: Array<TestResultModel>, sequenceEngine: SequenceEngine<Question>) {
    //     this.questions = questions;
    //     this.testResultModels = testResultModels;
    //     this.sequenceEngine = sequenceEngine;
    // }

    init(questions: Array<Question>, testResultModels: Array<TestResultModel>){
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

        this.quizStarted = true;
        this.quizFinished = false;
        this.currentQuestion = this.questions[this.sequenceEngine.index];
    }

    next() {
        console.log(this.sequenceEngine.isFinished())
        if (this.sequenceEngine.isFinished()){
            return;
        }

        
        this.calcPoints()
        this.sequenceEngine.next();
        this.checkPolicy();
        this.currentQuestion =  this.questions[this.sequenceEngine.index];
        this.currentIndex = this.sequenceEngine.index;
        
        if (this.sequenceEngine.isFinished()){
            this.quizStarted = false;
            this.quizFinished = true;
            return;
        }
    }

    calcPoints(){
        console.log("calcPoints")
        this.currentPoints += this.currentQuestion.getAnswerPoint();
    }

    private checkPolicy(){
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