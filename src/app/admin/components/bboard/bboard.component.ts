import { Component, TemplateRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BBoardService } from '../../../shared/services/bboard.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-bboard',
  templateUrl: './bboard.component.html',
  styleUrls: ['./bboard.component.css']
})
export class BboardComponent {
  error: any;
  bulletinBoardData: any[] | undefined;
  editorContent: string = '';

  editorConfig: AngularEditorConfig = {
    toolbarHiddenButtons: [
      [
      ],
      [
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'toggleEditorMode'
      ]
    ],
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '200px',
    placeholder: 'Ide írd a tartalmat...',
    translate: 'no',
    sanitize: false,
  };

  selectedBulletin: any = null;
  isEditing: boolean = false;
  modalRef: NgbModalRef | undefined;

  constructor(
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private bboardService: BBoardService) {
    this.getBbData();
  }

  getBbData() {
    this.bboardService.getAllBulletinBoardData().subscribe((data) => {
      this.bulletinBoardData = data;
      this.error = data;
    });
  }

  sanitizeHTML(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  formatTimestamp(timestamp: any): string {
    return this.datePipe.transform(timestamp.toDate(), 'yyyy MM-dd HH:mm') || '';
  }

  saveToDatabase(selectedBulletin: any, editorContent: any) {
    this.bboardService.saveToDatabase(selectedBulletin, editorContent);
    this.editorContent = '';

  }
  modifyBulletin(bulletin: any) {
    this.selectedBulletin = bulletin;
    this.editorContent = bulletin.content;
    this.isEditing = true;
    scrollTo(0, 0);
  }

  cancelModification() {
    this.selectedBulletin = null;
    this.editorContent = '';
    this.isEditing = false;
  }

  openModal(bulletinId: any, content: TemplateRef<any>): void {
    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
    });
    this.modalRef.result.then(
      (result) => {
        if (result === 'delete') {
          this.deleteBulletin(bulletinId);
        }
      }
    );
  }

  closeAndDelete(): void {
    this.modalRef?.close('delete');
  }

  close(): void {
    this.modalRef?.close();
  }

  deleteBulletin(bulletinId: any): void {
    this.bboardService.deleteBulletin(bulletinId);
    this.getBbData();
  }
}


