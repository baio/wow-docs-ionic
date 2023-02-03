import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { fromPairs } from 'lodash/fp';
import { getDocForm } from '../../definitions';
import {
  Doc,
  DocForm,
  DocFormatted,
  DocFormField,
  DocLabel,
  OptItem,
} from '../../models';
export interface UploadImageModalView {
  doc: Doc;
}

const createForm = (formBuilder: UntypedFormBuilder, doc: DocForm) => {
  const formGroupConfig = fromPairs(
    doc.fields.map((field) => [field.name, []])
  );

  const form = formBuilder.group(formGroupConfig);

  return form;
};

@Component({
  selector: 'app-doc-edit-form',
  templateUrl: 'doc-edit-form.component.html',
  styleUrls: ['doc-edit-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppDocEditFormComponent implements OnInit {
  formGroup: UntypedFormGroup;
  docForm: DocForm;
  _docLabel: DocLabel;

  readonly monthShortNames = [
    'янв',
    'февр',
    'март',
    'апр',
    'май',
    'июнь',
    'июль',
    'авг',
    'сент',
    'окт',
    'нояб',
    'дек',
  ];

  sexFields: OptItem[] = [
    {
      key: 'male',
      label: 'мужской',
    },
    {
      key: 'female',
      label: 'женский',
    },
  ];

  @Input() set docLabel(val: DocLabel) {
    if (this._docLabel !== val) {
      this._docLabel = val;
      this.updateForm();
    }
  }
  get docLabel() {
    return this._docLabel;
  }
  @Input() docFormatted: DocFormatted;

  constructor(private readonly fb: UntypedFormBuilder) {}

  ngOnInit() {
    this.updateForm();
  }

  trackByField(_, field: DocFormField) {
    return field.name;
  }

  trackByOptItem(_, optItem: OptItem) {
    return optItem.key;
  }

  private updateForm() {
    this.docForm = getDocForm(this.docLabel);
    if (!!this.docForm) {
      this.formGroup = createForm(this.fb, this.docForm);
      if (this.docFormatted) {
        this.formGroup.patchValue(this.docFormatted);
      }
    } else {
      this.docForm = null;
      this.formGroup = null;
    }
  }
}
