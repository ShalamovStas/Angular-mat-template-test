import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-custom-questions',
  templateUrl: './custom-questions.component.html',
  styleUrls: ['./custom-questions.component.scss']
})
export class CustomQuestionsComponent implements OnInit {
  questions = [
    {id: 1, text:'Episode I - The Phantom Menace'},
    {id: 2, text:'Episode II - Attack of the Clones'},
    {id: 3, text:'Episode III - Revenge of the Sith'},
    {id: 4, text:'Episode IV - A New Hope'},
    {id: 5, text: 'Episode V - The Empire Strikes Back'},
    {id: 6, text:'Episode VI - Return of the Jedi'},
    {id: 7, text:'Episode VII - The Force Awakens'},
    {id: 8, text:'Episode VIII - The Last Jedi'},
    {id: 9, text:'Episode IX – The Rise of Skywalker'},
    {id: 10, text:'Last- the end'}
  ];

  constructor() { }
  ngOnInit(): void {
    
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.questions, event.previousIndex, event.currentIndex);
  }
}
