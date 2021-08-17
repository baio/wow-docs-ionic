import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface AppDocImageView {
  images: string[];
  activeSlideIndex: number;
  showCameraButton: boolean;
  linkButtonMode: 'link' | 'unlink';
}

export interface ImageClickEvent {
  imageType: 'main' | 'attachment';
  attachmentIndex?: number;
}

@Component({
  selector: 'app-doc-image',
  templateUrl: 'doc-image.component.html',
  styleUrls: ['doc-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppDocImageComponent implements AfterViewInit {
  private readonly activeSlideIndex$ = new BehaviorSubject(0);
  private readonly imgBase64$ = new BehaviorSubject(null);
  private readonly attachmentsBase64$ = new BehaviorSubject<string[]>([]);
  readonly view$: Observable<AppDocImageView>;

  @Input() set imgBase64(val: string) {
    this.imgBase64$.next(val);
  }
  get imgBase64() {
    return this.imgBase64$.getValue();
  }
  @Input() set attachmentsBase64(val: string[]) {
    this.attachmentsBase64$.next(val || []);
  }
  get attachmentsBase64() {
    return this.attachmentsBase64$.getValue();
  }

  @Output() cameraClick = new EventEmitter();
  @Output() linkClick = new EventEmitter();
  @Output() unlinkClick = new EventEmitter<number>();
  @Output() imageClick = new EventEmitter<ImageClickEvent>();

  @ViewChild(IonSlides) ionSlides: IonSlides;

  slideOpts = {
    initialSlide: 0,
    speed: 50,
    loop: false,
  };

  constructor() {
    this.view$ = combineLatest([
      this.activeSlideIndex$,
      this.imgBase64$,
      this.attachmentsBase64$,
    ]).pipe(
      map(
        ([activeSlideIndex, imgBase64, attachmentsBase64]) =>
          ({
            images: [imgBase64, ...attachmentsBase64],
            activeSlideIndex,
            showCameraButton: activeSlideIndex === 0,
            linkButtonMode: activeSlideIndex === 0 ? 'link' : 'unlink',
          } as AppDocImageView)
      ),
      tap(console.log)
    );
  }

  ngAfterViewInit() {
    // Workaround swiper does not work after second init
    setTimeout(async () => {
      if (this.ionSlides) {
        (await this.ionSlides.getSwiper()).update();
      }
    }, 100);
  }

  trackByImage(_, img: string) {
    return img;
  }

  async onSlideChanged() {
    const activeIndex = this.ionSlides
      ? await this.ionSlides.getActiveIndex()
      : 0;
    this.activeSlideIndex$.next(activeIndex);
  }

  onCameraClicked($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    this.cameraClick.emit();
  }

  async onLinkClicked($event: MouseEvent, activeIndex: number) {
    $event.preventDefault();
    $event.stopPropagation();
    if (activeIndex === 0) {
      this.linkClick.emit();
    } else {
      this.unlinkClick.emit(activeIndex - 1);
    }
    // there is could be potential slide change!
    setTimeout(() => this.onSlideChanged(), 0);
  }

  onImageClick(index?: number) {
    if (index === undefined) {
      this.imageClick.emit({ imageType: 'main' });
    } else {
      this.imageClick.emit({
        imageType: index === 0 ? 'main' : 'attachment',
        attachmentIndex: index === 0 ? undefined : index - 1,
      });
    }
  }
}
