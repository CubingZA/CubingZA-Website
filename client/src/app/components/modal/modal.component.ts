import { Component, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ModalComponent {

  faXmark = faXmark;

  @Input() id?: string;
  isOpen = false;

  constructor(
    private modalService: ModalService,
    private element: ElementRef
  ) { }

  ngOnInit() {
    this.modalService.add(this);
    const nativeElement = this.element.nativeElement;
    
    document.body.appendChild(nativeElement);

    nativeElement.addEventListener('click', (el: any) => {
      if (el.target.className === 'modal') {
        this.close();
      }
    });
  }

  ngOnDestroy() {
    this.modalService.remove(this);
    this.element.nativeElement.remove();
  }

  open() {
    this.isOpen = true;
    document.body.classList.add('has-open-modal');
  }

  close() {
    this.isOpen = false;
    document.body.classList.remove('has-open-modal');
  }

}
