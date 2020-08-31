import { Component, OnInit, Inject } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { EditQuestionViewModel, Question, QuestionType } from "./questionModels";
import { trigger, state, transition, animate, style } from '@angular/animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-overview-example-dialog',
  templateUrl: './dialog.html'
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


  // public questions = [
  //   { id: 1, text: 'Episode I - The Phantom Menace' },
  //   { id: 2, text: 'Episode II - Attack of the Clones' },
  //   { id: 3, text: 'Episode III - Revenge of the Sith' },
  //   { id: 4, text: 'Episode IV - A New Hope' },
  //   { id: 5, text: 'Episode V - The Empire Strikes Back' },
  //   { id: 6, text: 'Episode VI - Return of the Jedi' },
  //   { id: 7, text: 'Episode VII - The Force Awakens' },
  //   { id: 8, text: 'Episode VIII - The Last Jedi' },
  //   { id: 9, text: 'Episode IX – The Rise of Skywalker' },
  //   { id: 10, text: 'Last- the end' }
  // ];

  constructor(public dialog: MatDialog) { }
  ngOnInit(): void {

    let querstion_1 = new Question(this.newGuid(), 'Episode I - The Phantom Menace');
    querstion_1.questionType = QuestionType.TRUE_FALSE_QUESTION;
    this.questions.push(querstion_1);

    let querstion_2 = new Question(this.newGuid(), 'Episode II - Attack of the Clones');
    querstion_2.questionType = QuestionType.INPUT_QUESTION;
    this.questions.push(querstion_2);

    let querstion_3 = new Question(this.newGuid(), 'Episode III - Revenge of the Sith');
    querstion_3.questionType = QuestionType.TRUE_FALSE_QUESTION;
    this.questions.push(querstion_3);

    let querstion_4 = new Question(this.newGuid(), 'Question parent');
    querstion_4.questionType = QuestionType.TRUE_FALSE_QUESTION;
    this.questions.push(querstion_4);

    let child_question = new Question(this.newGuid(), 'Question child');
    child_question.questionType = QuestionType.TRUE_FALSE_QUESTION;
    querstion_4.childQuestion = child_question;

    let querstion_6 = new Question(this.newGuid(), 'Episode IV - A New Hope');
    querstion_6.questionType = QuestionType.TRUE_FALSE_QUESTION;
    this.questions.push(querstion_6);
  }

  drop(event: CdkDragDrop<string[]>) {

    let currentQuestion = this.questions[event.previousIndex];

    moveItemInArray(this.questions, event.previousIndex, event.currentIndex);
  }

  editCard(id: any) {
    this.isOpen = !this.isOpen;
    this.editQuestionViewModel.editQuestionMode = true;
    let currentQuestion = this.questions.find(x => { return x.id === id });

    if (!currentQuestion) {
      console.error("question not found")
      this.editQuestionViewModel.editQuestionMode = false;
      this.editQuestionViewModel.currentQuestion = undefined;
      return;
    }

    let parentQuestion = new Question(currentQuestion?.id, currentQuestion?.text)
    let childQuestion = new Question(currentQuestion?.childQuestion?.id, currentQuestion?.childQuestion?.text)
    parentQuestion.childQuestion = childQuestion;

    parentQuestion.questionType = (currentQuestion ? currentQuestion?.questionType : QuestionType.UNDEFINED) + '';
    childQuestion.questionType = (currentQuestion?.childQuestion ? currentQuestion?.childQuestion?.questionType : QuestionType.UNDEFINED) + '';

    parentQuestion.pointsPositive = currentQuestion?.pointsPositive
    parentQuestion.pointsNegative = currentQuestion?.pointsNegative

    parentQuestion.childQuestion.pointsPositive = currentQuestion?.childQuestion?.pointsPositive
    parentQuestion.childQuestion.pointsNegative = currentQuestion?.childQuestion?.pointsNegative

    this.editQuestionViewModel.currentQuestion = parentQuestion;

  }

  saveQuestion() {
    console.log(this.editQuestionViewModel.currentQuestion?.questionType);
    for (let index = 0; index < this.questions.length; index++) {
      if (this.questions[index].id === this.editQuestionViewModel.currentQuestion?.id) {
        this.editQuestionByIndex(index);
        break;
      }
    }
    this.onCloseEdit();
  }

  editQuestionByIndex(index: number) {
    this.questions[index].text = this.editQuestionViewModel.currentQuestion?.text as string;
    this.questions[index].questionType = this.editQuestionViewModel.currentQuestion?.questionType;
    this.questions[index].pointsPositive = this.editQuestionViewModel.currentQuestion?.pointsPositive;
    this.questions[index].pointsNegative = this.editQuestionViewModel.currentQuestion?.pointsNegative;

    if (this.editQuestionViewModel.currentQuestion?.childQuestion) {
      this.questions[index].childQuestion = this.editQuestionViewModel.currentQuestion?.childQuestion;
    }
    if (!this.editQuestionViewModel.currentQuestion?.childQuestion?.text || this.editQuestionViewModel.currentQuestion?.childQuestion?.text === '')
      this.questions[index].childQuestion = undefined;
  }

  onCloseEdit() {
    this.editQuestionViewModel.editQuestionMode = false;
    this.editQuestionViewModel.addQuestionMode = false;
    this.editQuestionViewModel.currentQuestion = undefined;
    this.isOpen = !this.isOpen;
  }

  deleteQuestion(id: any) {

    // for (let index = 0; index < this.questions.length; index ++) {
    //   if (this.questions[index].id === id) {
    //     let basQuestions = this.questions;
    //     console.log(basQuestions)
    //     console.log(this.questions[index])
    //     let removed = basQuestions.slice(index, 1);
    //     console.log(basQuestions)

    //     this.questions = basQuestions;

    //      break;
    //   }
    // }

    this.questions = this.questions.filter(function (value, index, arr) { return value.id !== id; })
  }

  addQuestion() {
    this.editQuestionViewModel.editQuestionMode = false;
    this.editQuestionViewModel.addQuestionMode = true;
    this.editQuestionViewModel.currentQuestion = new Question(this.newGuid(), '');

  }

  saveNewQuestion() {
    console.log(this.editQuestionViewModel.currentQuestion?.questionType)
    if (this.editQuestionViewModel.currentQuestion?.questionType == QuestionType.TRUE_FALSE_QUESTION)
      console.log("True false question")

    let newQuestion = new Question(this.editQuestionViewModel.currentQuestion?.id, this.editQuestionViewModel.currentQuestion?.text)
    newQuestion.questionType = this.editQuestionViewModel.currentQuestion ? this.editQuestionViewModel.currentQuestion.questionType : QuestionType.UNDEFINED;

    this.questions.push(newQuestion as any);
    this.editQuestionViewModel.addQuestionMode = false;
    this.editQuestionViewModel.currentQuestion = undefined;
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

  newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

