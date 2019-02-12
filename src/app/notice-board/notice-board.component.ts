import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { NoticeService } from '../services/notice.service';
import { NbDialogService } from '@nebular/theme';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-notice-board',
  templateUrl: './notice-board.component.html',
  styleUrls: ['./notice-board.component.scss'],
})
export class NoticeBoardComponent implements OnInit {
  noticeForm: FormGroup;
  isAdmin: boolean;
  notices: any;
  cardColor: any;
  deletableNoticeId: string;
  mode: string;
  noticeId: any;

  constructor(
    private _noticeService: NoticeService,
    private dialogService: NbDialogService,
    private _toastService: ToastService,
    private _authService: AuthService,
    private cd: ChangeDetectorRef
  ) {
    this.createForm();
  }

  refresh() {
    this.cd.detectChanges();
  }

  createForm(notice?: any) {
    if (notice) {
      this.mode = 'edit';
      this.noticeId = notice.key;
      this.noticeForm = new FormGroup({
        title: new FormControl(notice.title || '', Validators.required),
        message: new FormControl(notice.message || '', Validators.required),
        creationDate: new FormControl(notice.creationDate || new Date().toLocaleString()),
      });
      return;
    }
    this.mode = 'create';
    this.noticeId = '';
    this.noticeForm = new FormGroup({
      title: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required),
      creationDate: new FormControl(new Date().toLocaleString()),
    });
  }

  ngOnInit() {
    this.isAdmin = this._authService.isAdminOrRedisent;
    if (this.isAdmin) {
      this.cardColor = 'danger';
      this.getAllNotices();
    } else {
      this.cardColor = 'success';
      this.getAllNotices();
    }
  }

  createNotice(ref: any) {
    let notice = this.noticeForm.value;
    notice.creationDate = new Date().toLocaleString();
    this._noticeService
      .createNotice(notice)
      .then(data => {
        if (data) {
          ref.close();
          this.showToast('success');
        }
        this.noticeForm.reset();
      })
      .catch(e => {
        console.log(e);
        this.showToast('fail');
      });
  }

  updateNotice(ref: any) {
    let notice = this.noticeForm.value;
    notice.creationDate = new Date().toLocaleString();
    this._noticeService
      .updateNotice(notice, this.noticeId)
      .then(data => {
        ref.close();
        console.log('edited');
        this.showToast('success', 'Notice is updated successfully!');
        this.noticeForm.reset();
      })
      .catch(e => {
        console.log(e);
        this.showToast('fail', 'something went wrong while updating the notice!');
      });
  }

  likeNotice(notice: any) {
    this._noticeService
      .likeNotice(notice.key)
      .then(data => {
        console.log('like: ', data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  dislikeNotice(notice: any) {
    this._noticeService
      .dislikeNotice(notice.key)
      .then(data => {
        console.log('dislike: ', data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  getAllNotices() {
    this._noticeService.getAllNotices().subscribe(notices => {
      this.notices = notices;
      notices.forEach((notice, i) => {
        this._noticeService.getLikes(notice.key).subscribe((likes: any) => {
          this.notices[i].likesCount = likes.length;
          this.refresh();
        });
        this._noticeService.getDislikes(notice.key).subscribe(dislikes => {
          this.notices[i].dislikesCount = dislikes.length;
          this.refresh();
        });
        this._noticeService.checkLike(notice.key).subscribe(data => {
          this.notices[i].liked = data;
        });
        this._noticeService.checkDislike(notice.key).subscribe(data => {
          this.notices[i].disliked = data;
        });
      });
      this.refresh();
    });
  }

  editNoticeDialog(dialog: TemplateRef<any>, notice: any) {
    if (notice) {
      this.createForm(notice);
      this.noticeId = notice.key;
      this.dialogService.open(dialog, { context: 'Edit notice title and message' });
      return;
    }
    this.createForm();
    this.dialogService.open(dialog, { context: 'Add notice title and message' });
  }

  removeNotice(ref: any) {
    ref.close();
    this._noticeService
      .removeNotice(this.deletableNoticeId)
      .then(() => {
        this.showToast('success', 'Notice has been deleted successfully!');
      })
      .catch(e => {
        console.log(e);
        this.showToast('fail', 'Error while deleting the notice!');
      });
  }

  removeLikeFromNotice(notice: any) {
    this._noticeService
      .removeLikeFromNotice(notice.key)
      .then(() => {
        console.log('like removed');
      })
      .catch(e => {
        console.log(e);
      });
  }

  removeDislikeFromNotice(notice: any) {
    this._noticeService
      .removeDislikeFromNotice(notice.key)
      .then(() => {
        console.log('dislike removed');
      })
      .catch(e => {
        console.log(e);
      });
  }

  showToast(type: string, message?: string) {
    if (type === 'fail') {
      this._toastService.showToast(
        'top-right',
        'danger',
        'Failed',
        message || 'Failed to create the notice!.'
      );
    } else {
      this._toastService.showToast(
        'top-right',
        'success',
        'Success',
        message || 'Notice is created Successfully!.'
      );
    }
  }

  showDialog(notice: any, dialog: TemplateRef<any>) {
    this.deletableNoticeId = notice.key;
    this.dialogService.open(dialog, { context: 'Are you sure for deleting the notice?' });
  }
}
