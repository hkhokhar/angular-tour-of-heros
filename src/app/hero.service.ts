import { Injectable } from '@angular/core';
import {Observable } from 'rxjs/Observable';
import { of  } from 'rxjs/observable/of';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';

import {MessageService} from './message.service';
import { Observer } from 'rxjs/Observer';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()

export class HeroService {

  private heroesUrl = 'api/heroes'; // URL to web api

  constructor(private messageService: MessageService, private http: HttpClient) { }

  getHeroes():  Observable<Hero[]> {
    // return of(HEROES);
    /** GET Heroes from the server **/
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(heroes => this.log('fetched heroes')),
        catchError(this.handleError('getHeroes', []))
      );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions)
      .pipe(
        // tslint:disable-next-line:no-shadowed-variable
        tap((hero: Hero) => this.log('added hero w/ id=' + hero.id)),
        catchError(this.handleError<Hero>('addHero'))
      );
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = this.heroesUrl + '/' + id;

    return this.http.delete<Hero>(url, httpOptions)
      .pipe(
        tap(_ => this.log('deleted hero id=${id}')),
        catchError(this.handleError<Hero>('deleteHero'))
      );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }

    const url = this.heroesUrl + '/?name=' + term;

    return this.http.get<Hero[]>(url)
      .pipe(
        tap(_ => this.log('found heroes matching "${term}"')),
        catchError(this.handleError<Hero[]>('searchHeroes', []))
      );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions)
      .pipe(
        tap(_ => this.log('updated hero id=' + hero.id)),
        catchError(this.handleError<any>('updateHero'))
      );
  }

  private handleError<T> (operation = 'operator', result?: T) {
    return (error: any): Observable<T> => {
        console.error(error);

        this.log(operation + ' failed: ' + error.message);

        return of(result as T);
    };
  }

  getHero(id: number): Observable<Hero> {
   // TODO: send the message _after_ fectching the hero
   // this.messageService.add('HeroService: fetched hero id=${id}');
   // return of(HEROES.find(hero => hero.id === id));

   const url = this.heroesUrl + '/' + id;

   return this.http.get<Hero>(url)
    .pipe(
      tap( _ => this.log('fetched hero id=${id}')),
      catchError(this.handleError<Hero>('getHero id=${id}'))
    );

  }

  /** Log a HeroService message with the MessageService **/
  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }

}
