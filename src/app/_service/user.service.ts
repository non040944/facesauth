import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map,take } from 'rxjs/operators';

const API_URL = 'http://localhost:8080/api/test/';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getPublicContent() {
    return this.http.get('http://localhost:8080/api/test/all').pipe(take(1),
      map((response: any) => {
        //console.log(response)
        return response; // Modify this according to your API response structure
      })
    );
  }

  getUserBoard(userData: any): Observable<any> {
    const { email, password } = userData;
    const params = new HttpParams().set('email', email);
    return this.http.get('http://localhost:8080/api/test2/user/' + email, { responseType: 'text' });
  }
  
}
