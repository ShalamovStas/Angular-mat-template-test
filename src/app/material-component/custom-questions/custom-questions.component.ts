import { Component, OnInit, Inject } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { EditQuestionViewModel, Question, QuestionType, TestResultModel } from "./questionModels";
import { trigger, state, transition, animate, style } from '@angular/animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogAddQuestionComponent } from './dialogs/dialog-add-question'
import { DialogEditTestResultModelComponent } from './dialogs/edit-test-result-model-dialog'
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { QuestionWizardEngine } from './questionWizard';


@Component({
  selector: 'app-dialog-overview-example-dialog',
  templateUrl: './edit-policy-dialog.html'
})
export class DialogEditPolicyComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogEditPolicyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


@Component({
  selector: 'app-custom-questions',
  templateUrl: './custom-questions.component.html',
  styleUrls: ['./custom-questions.component.scss'],
})

export class CustomQuestionsComponent implements OnInit {
  public editQuestionViewModel: EditQuestionViewModel = new EditQuestionViewModel();
  public questions: Array<Question> = new Array<Question>();
  isOpen = false;
  public testResultModels: Array<TestResultModel> = new Array<TestResultModel>()
  public questionWizardEngine: QuestionWizardEngine = new QuestionWizardEngine();

  constructor(public dialog: MatDialog, public snackBar: MatSnackBar) { }
  ngOnInit(): void {

    let question_1 = new Question();
    question_1.id = this.newGuid();
    question_1.text = 'Episode I - The Phantom Menace';
    question_1.questionType = QuestionType.TRUE_FALSE_QUESTION;
    this.questions.push(question_1);

    let question_2 = new Question();
    question_2.id = this.newGuid();
    question_2.text = 'Episode II - Attack of the Clones';
    question_2.questionType = QuestionType.INPUT_QUESTION;
    this.questions.push(question_2);

    let question_3 = new Question();
    question_3.id = this.newGuid()
    question_3.text = 'Episode III - Revenge of the Sith';
    question_3.questionType = QuestionType.TRUE_FALSE_QUESTION;
    this.questions.push(question_3);

    let question_4 = new Question();
    question_4.id = this.newGuid();
    question_4.text = 'Within the last 14 days, have you come in contact with a person with a confirmed or suspected case of a newly identified viral illness?';
    question_4.questionType = QuestionType.TRUE_FALSE_QUESTION;
    this.questions.push(question_4);

    let child_question = new Question();
    child_question.id = this.newGuid();
    child_question.text = 'Did you wear protective equipment?';
    child_question.questionType = QuestionType.TRUE_FALSE_QUESTION;
    question_4.childQuestion = child_question;

    let defaultResult = new TestResultModel();
    defaultResult.id = this.newGuid();
    defaultResult.message = 'Test passed!';
    defaultResult.points = 10;

    this.testResultModels.push(defaultResult)

    this.questionWizardEngine.init(this.questions, this.testResultModels);
  }

  drop(event: CdkDragDrop<string[]>) {

    let currentQuestion = this.questions[event.previousIndex];

    moveItemInArray(this.questions, event.previousIndex, event.currentIndex);
  }

  dropTestResult(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.testResultModels, event.previousIndex, event.currentIndex);
  }

  editCard(id: any) {
    let currentQuestion = this.questions.find(x => { return x.id === id });
    if (!currentQuestion) {
      console.error("question not found")
      this.editQuestionViewModel.editQuestionMode = false;
      this.editQuestionViewModel.currentQuestion = undefined;
      return;
    }

    let parentQuestion = new Question()
    parentQuestion.id = currentQuestion.id;
    parentQuestion.text = currentQuestion.text;
    parentQuestion.childQuestion = currentQuestion.childQuestion;


    parentQuestion.questionType = (currentQuestion ? currentQuestion?.questionType : QuestionType.UNDEFINED) + '';

    parentQuestion.pointsPositive = currentQuestion?.pointsPositive
    parentQuestion.pointsNegative = currentQuestion?.pointsNegative

    console.log(parentQuestion)
    const dialogNewQuestion = this.dialog.open(DialogAddQuestionComponent, {
      width: '500px',
      data: parentQuestion
    });

    dialogNewQuestion.afterClosed().subscribe(editedQuestion => {
      console.log(editedQuestion);
      if (!editedQuestion)
        return;

      this.saveQuestion(editedQuestion);
      this.openSnackBar('Saved', 'Ok')
    });
  }

  addChildQuestion(id: any) {
    let currentQuestion = this.questions.find(x => { return x.id === id });
    if (!currentQuestion) {
      console.error("question not found")
      this.editQuestionViewModel.editQuestionMode = false;
      this.editQuestionViewModel.currentQuestion = undefined;
      return;
    }

    let newQuestion = new Question();
    newQuestion.questionType = '1';
    const dialogNewQuestion = this.dialog.open(DialogAddQuestionComponent, {
      width: '500px',
      data: newQuestion
    });

    dialogNewQuestion.afterClosed().subscribe(newQuestion => {
      if (!newQuestion)
        return;

      if (currentQuestion)
        currentQuestion.childQuestion = newQuestion;

      this.openSnackBar('Child question added', 'Ok')
    });
  }

  editChildQuestion(id: any) {
    let currentQuestion = this.questions.find(x => { return x.id === id });
    if (!currentQuestion) {
      console.error("question not found")
      this.editQuestionViewModel.editQuestionMode = false;
      this.editQuestionViewModel.currentQuestion = undefined;
      return;
    }

    let newQuestion = new Question();
    newQuestion.questionType = currentQuestion.childQuestion?.questionType + '';
    newQuestion.pointsNegative = currentQuestion.childQuestion?.pointsNegative;
    newQuestion.pointsPositive = currentQuestion.childQuestion?.pointsPositive;
    newQuestion.text = currentQuestion.childQuestion?.text;

    const dialogNewQuestion = this.dialog.open(DialogAddQuestionComponent, {
      width: '500px',
      data: newQuestion
    });

    dialogNewQuestion.afterClosed().subscribe(newQuestion => {
      if (!newQuestion)
        return;

      if (currentQuestion)
        currentQuestion.childQuestion = newQuestion;

      this.openSnackBar('Child updated', 'Ok')
    });
  }

  saveQuestion(question: Question | undefined) {
    if (!question)
      return;

    for (let index = 0; index < this.questions.length; index++) {
      if (this.questions[index].id === question.id) {
        this.editQuestionByIndex(index, question);
        break;
      }
    }
    this.onCloseEdit();
  }



  editQuestionByIndex(index: number, question: Question) {
    this.questions[index].text = question.text as string;
    this.questions[index].questionType = question.questionType;
    this.questions[index].pointsPositive = question.pointsPositive;
    this.questions[index].pointsNegative = question.pointsNegative;

    if (question.childQuestion) {
      this.questions[index].childQuestion = question.childQuestion;
    }
    if (!question.childQuestion?.text || question.childQuestion?.text === '')
      this.questions[index].childQuestion = undefined;
  }

  onCloseEdit() {
    this.editQuestionViewModel.editQuestionMode = false;
    this.editQuestionViewModel.addQuestionMode = false;
    this.editQuestionViewModel.currentQuestion = undefined;
    this.isOpen = !this.isOpen;
  }

  deleteQuestion(id: any) {
    this.questions = this.questions.filter(function (value, index, arr) { return value.id !== id; })
  }

  AddNewQuestionDialog() {
    let newQuestion = new Question();
    newQuestion.questionType = '1';
    const dialogNewQuestion = this.dialog.open(DialogAddQuestionComponent, {
      width: '500px',
      data: newQuestion
    });

    dialogNewQuestion.afterClosed().subscribe(newQuestion => {
      console.log('The dialog was closed');
      console.log(newQuestion);
      if (!newQuestion)
        return;

      this.saveNewQuestion(newQuestion);

      this.openSnackBar('New message added', 'Ok')
    });

  }

  openSnackBar(message: string, action: string) {
    let config = new MatSnackBarConfig();
    config.panelClass = ['snack-bar'];

    this.snackBar.open(message, action, {
      duration: 5000,
      panelClass: ['snack-bar']
    });
  }

  saveNewQuestion(newQuestion: Question) {
    newQuestion.id = this.newGuid();
    this.questions.push(newQuestion as any);
  }

  openDialog(id: any): void {
    let questionStrategy = this.questions.find(q => { return q.id === id })?.childQuestion?.questionTrueFalseStrategy;
    const dialogRef = this.dialog.open(DialogEditPolicyComponent, {
      width: '350px',
      data: { trueFalseStrategy: questionStrategy, questionId: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (!result)
        return;
      let question = this.questions.find(q => { return q.id === result.questionId })
      if (!question) {
        console.error("question not found");
        return;
      }

      if (question.childQuestion) {
        question.childQuestion.questionTrueFalseStrategy = result.trueFalseStrategy;
        console.log(question.childQuestion.questionTrueFalseStrategy)
      }
    });
  }


  // Results

  addResult() {
    let newTestResult = new TestResultModel();
    newTestResult.id = this.newGuid();

    const dialogRef = this.dialog.open(DialogEditTestResultModelComponent, {
      width: '350px',
      data: newTestResult
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result)
        return;

      this.testResultModels.push(result)
    });
  }

  editTestResultModel(id: any) {
    let newTestResult = new TestResultModel();
    let currentResult = this.testResultModels.find(x => { return x.id === id });
    if (!currentResult)
      return;

    newTestResult.id = currentResult.id;
    newTestResult.message = currentResult.message;
    newTestResult.points = currentResult.points;

    const dialogRef = this.dialog.open(DialogEditTestResultModelComponent, {
      width: '450px',
      data: newTestResult
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result)
        return;

      if (currentResult) {
        currentResult.message = result.message;
        currentResult.points = result.points;
      }
    });
  }

  deleteTestResultModel(id: any) {
    this.testResultModels = this.testResultModels.filter(function (value, index, arr) { return value.id !== id; })
  }

  //quiz

  startQuiz() {
    this.questionWizardEngine.setStateStart();
    console.log(this.questions)
  }

  trueFalseAnswer(res: boolean) {
    this.questionWizardEngine.currentQuestion.handleAnswer(res);
    this.questionWizardEngine.next()
  }

  inputAnswer(res: string) {
    this.questionWizardEngine.currentQuestion.handleAnswer(true, res);
    this.questionWizardEngine.next()
  }


  newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

