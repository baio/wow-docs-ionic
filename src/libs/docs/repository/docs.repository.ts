import { Injectable } from '@angular/core';
import { pullAt } from 'lodash/fp';
import { DbService } from '../../db';
import {
  Doc,
  DocAttachment,
  DocFormatted,
  DocState,
  DocStored,
} from '../models';
import { getDocFormattedUpdateValues } from './utils/get-formatted-update-values';

@Injectable()
export class DocsRepositoryService {
  constructor(private readonly db: DbService) {}

  async addDoc(id: string, imgBase64: string) {
    // add one user with statement and values
    const sqlcmd = 'INSERT INTO docs (id,imgBase64,createDate) VALUES (?,?,?)';
    const values = [id, imgBase64, new Date().getTime()];
    const res = await this.db.runCommand(sqlcmd, values);
    console.log('$$$ addDoc result', res);
  }

  async createDoc(doc: Doc) {
    // add one user with statement and values
    const sqlcmd =
      // eslint-disable-next-line max-len
      'INSERT INTO docs (id,imgBase64,storedProvider,storedUrl,storedStatus,labeledLabel,content,lastName,firstMiddleName,createDate,tags,comment,attachments) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)';
    const values = [
      doc.id,
      doc.imgBase64,
      doc.stored?.provider,
      doc.stored?.url,
      doc.stored?.status,
      doc.labeled?.label,
      doc.formatted && JSON.stringify(doc.formatted),
      doc.formatted?.lastName,
      doc.formatted && (doc.formatted.firstName || doc.formatted.lastName)
        ? [doc.formatted.firstName, doc.formatted.lastName].join(' ')
        : null,
      new Date().getTime(),
      doc.tags && doc.tags.join(','),
      doc.comment,
      doc.attachments && doc.attachments.join(','),
    ];
    const res = await this.db.runCommand(sqlcmd, values);
    console.log('$$$ addDoc result', res);
  }

  async updateDocState(id: string, docState: DocState) {
    // add one user with statement and values
    const sqlcmd = `UPDATE docs SET storedProvider = ?, storedUrl = ?, storedStatus = ?, labeledLabel = ? WHERE id = ?`;
    const values = [
      docState.stored?.provider,
      docState.stored?.url,
      docState.stored?.status,
      docState.labeled?.label,
      id,
    ];

    const res = await this.db.runCommand(sqlcmd, values);
    console.log('$$$ updateDocState result', res);
  }

  async updateDocImage(id: string, base64: string) {
    // add one user with statement and values
    const sqlcmd = `UPDATE docs SET imgBase64 = ? WHERE id = ?`;
    const values = [base64, id];

    const res = await this.db.runCommand(sqlcmd, values);
    console.log('$$$ updateDocImage result', res);
  }

  async updateDocFormatted(id: string, docFormatted: DocFormatted) {
    if (!docFormatted) {
      const sqlCmd =
        'UPDATE docs SET lastName = null, firstMiddleName = null, content = null, labeledLabel = null  WHERE id = ?';
      const res = await this.db.runCommand(sqlCmd, [id]);
      console.log('$$$ updateDocState result', res);
    } else {
      const values = getDocFormattedUpdateValues(docFormatted);
      if (values) {
        const content = docFormatted && JSON.stringify(docFormatted);
        const sqlCmd =
          'UPDATE docs SET lastName = ?, firstMiddleName = ?, content = ?, labeledLabel = ?  WHERE id = ?';
        const cmdValues = [
          values.lastName,
          values.firstMiddleName,
          content,
          docFormatted && docFormatted.kind,
          id,
        ];
        const res = await this.db.runCommand(sqlCmd, cmdValues);
        console.log('$$$ updateDocState result', res);
      } else {
        console.warn('updateDocFormatted values not found !!!', docFormatted);
      }
    }
  }

  async updateDocStored(id: string, docStored: DocStored) {
    // add one user with statement and values
    const sqlcmd = `UPDATE docs SET storedProvider = ?, storedUrl = ?, storedStatus = ? WHERE id = ?`;
    const values = [docStored?.provider, docStored?.url, docStored?.status, id];

    const res = await this.db.runCommand(sqlcmd, values);
    console.log('$$$ updateDocState result', res);
  }

  async setDocTags(id: string, tags: string[]) {
    const sqlCmd = 'UPDATE docs SET tags = ? WHERE id = ?';
    const cmdValues = [tags && tags.length > 0 ? tags.join(',') : null, id];
    const res = await this.db.runCommand(sqlCmd, cmdValues);
    console.log('$$$ setDocTags result', res);
  }

  async setDocComment(id: string, comment: string) {
    const sqlCmd = 'UPDATE docs SET comment = ? WHERE id = ?';
    const cmdValues = [comment || null, id];
    const res = await this.db.runCommand(sqlCmd, cmdValues);
    console.log('$$$ setDocComment result', res);
  }

  async deleteDoc(id: string, attachments: string[]) {
    // add one user with statement and values
    const sqlcmd = 'DELETE FROM docs WHERE id = ?';
    const values = [id];
    const res = await this.db.runCommand(sqlcmd, values);
    console.log('$$$ deleteDoc result', res);

    // attachments
    if ((attachments || []).length > 0) {
      const sqlcmd1 = 'DELETE FROM attachments WHERE id IN (?)';
      const values1 = [attachments.join(',')];
      const res1 = await this.db.runCommand(sqlcmd1, values1);
      console.log('$$$ deleteDoc attachments result', res1);
    }
  }

  //
  private async addDocAttachmentToDoc(
    doc: { id: string; attachments: string[] },
    attachmentId: string
  ) {
    const sqlCmd = 'UPDATE docs SET attachments = ? WHERE id = ?';
    const updatedAttachments = [attachmentId, ...(doc.attachments || [])].join(
      ','
    );
    const cmdValues = [updatedAttachments, doc.id];
    const res = await this.db.runCommand(sqlCmd, cmdValues);
    console.log('$$$ addDocAttachmentToDoc', res);
    //
  }

  async addDocAttachmentToAttachments(
    attachmentId: string,
    imageBase64: string
  ) {
    const sqlcmd = 'INSERT INTO attachments (id,imgBase64) VALUES (?,?)';
    const values = [attachmentId, imageBase64];
    const res = await this.db.runCommand(sqlcmd, values);
    console.log('$$$ addDocAttachmentToAttachments', res);
  }

  async addDocAttachment(
    doc: { id: string; attachments: string[] },
    attachmentId: string,
    imageBase64: string
  ) {
    await this.addDocAttachmentToAttachments(attachmentId, imageBase64);
    await this.addDocAttachmentToDoc(doc, attachmentId);
  }

  //
  private async removeDocAttachmentFromDoc(
    doc: { id: string; attachments: string[] },
    attachmentIndex: number
  ) {
    const sqlCmd = 'UPDATE docs SET attachments = ? WHERE id = ?';
    const updatedAttachments = pullAt([attachmentIndex], doc.attachments || []);
    const cmdValues = [
      updatedAttachments.length > 0 ? updatedAttachments.join(',') : null,
      doc.id,
    ];
    const res = await this.db.runCommand(sqlCmd, cmdValues);
    console.log('$$$ removeDocAttachmentFromDoc', res);
    //
  }

  private async removeDocAttachmentFromAttachments(attachmentId: string) {
    const sqlcmd = 'DELETE FROM attachments WHERE id = ?';
    const values = [attachmentId];
    const res = await this.db.runCommand(sqlcmd, values);
    console.log('$$$ removeDocAttachmentFromAttachments', res);
  }

  async removeDocAttachment(
    doc: { id: string; attachments: string[] },
    attachmentIndex: number
  ) {
    const attachmentId = doc.attachments[attachmentIndex];
    await this.removeDocAttachmentFromDoc(doc, attachmentIndex);
    await this.removeDocAttachmentFromAttachments(attachmentId);
  }

  async getDocs() {
    // add one user with statement and values
    const sqlcmd = 'SELECT * FROM docs ORDER BY createDate DESC;';
    const res = await this.db.runQuery(sqlcmd);
    console.log('$$$ getDocs result', res);
    const values = res.values;
    return values.map(
      (m) =>
        ({
          id: m.id,
          imgBase64: m.imgBase64,
          date: m.createDate,
          stored: m.storedProvider
            ? {
                provider: m.storedProvider,
                url: m.storedUrl,
                status: m.storedStatus,
              }
            : null,
          labeled: m.labeledLabel
            ? {
                label: m.labeledLabel,
              }
            : null,
          formatted: m.content ? JSON.parse(m.content) : null,
          tags: m.tags ? m.tags.split(',') : [],
          comment: m.comment,
          attachments: m.attachments ? m.attachments.split(',') : [],
        } as Doc)
    );
  }

  async getAttachments() {
    // add one user with statement and values
    const sqlcmd = 'SELECT * FROM attachments;';
    const res = await this.db.runQuery(sqlcmd);
    console.log('$$$ getAttachments result', res);
    const values = res.values;
    return values.map(
      (m) =>
        ({
          id: m.id,
          imgBase64: m.imgBase64,
        } as DocAttachment)
    );
  }
}
