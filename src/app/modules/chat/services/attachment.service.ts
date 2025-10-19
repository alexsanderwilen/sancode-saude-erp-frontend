import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

export interface UploadResponse {
  id: number;
  uploadUrl: string;
  storageKey: string;
}

export interface DownloadResponse { url: string }

@Injectable({ providedIn: 'root' })
export class AttachmentService {
  private http = inject(HttpClient);
  private apiUrl = '/api/chat/files';

  requestUpload(file: File): Observable<UploadResponse> {
    const body = {
      filename: file.name,
      contentType: file.type || 'application/octet-stream',
      size: file.size
    };
    return this.http.post<UploadResponse>(`${this.apiUrl}/uploads`, body);
  }

  putToPresignedUrl(url: string, file: File): Observable<Response> {
    return from(fetch(url, { method: 'PUT', body: file }));
  }

  getDownloadUrl(id: number): Observable<string> {
    return this.http.get<DownloadResponse>(`${this.apiUrl}/${id}/download`).pipe(map(r => r.url));
  }
}

