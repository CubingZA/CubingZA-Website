import { Injectable } from '@angular/core';

const events: CompEvent[] = [
  {
    name: "3x3x3 Cube",
    id: "333",
    rank: 10
  },{
    name: "2x2x2 Cube",
    id: "222",
    rank: 20
  },{
    name: "4x4x4 Cube",
    id: "444",
    rank: 30
  },{
    name: "5x5x5 Cube",
    id: "555",
    rank: 40
  },{
    name: "6x6x6 Cube",
    id: "666",
    rank: 50
  },{
    name: "7x7x7 Cube",
    id: "777",
    rank: 60
  },{
    name: "3x3x3 Blindfolded",
    id: "333bf",
    rank: 70
  },{
    name: "3x3x3 Fewest Moves",
    id: "333fm",
    rank: 80
  },{
    name: "3x3x3 One-Handed",
    id: "333oh",
    rank: 90
  },{
    name: "Clock",
    id: "clock",
    rank: 110
  },{
    name: "Megaminx",
    id: "minx",
    rank: 120
  },{
    name: "Pyraminx",
    id: "pyram",
    rank: 130
  },{
    name: "Skewb",
    id: "skewb",
    rank: 140
  },{
    name: "Square-1",
    id: "sq1",
    rank: 150
  },{
    name: "4x4x4 Blindfolded",
    id: "444bf",
    rank: 160
  },{
    name: "5x5x5 Blindfolded",
    id: "555bf",
    rank: 170
  },{
    name: "3x3x3 Multi-Blind",
    id: "333mbf",
    rank: 180
  }
];

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor() { }

  getEvents(): CompEvent[] {
    return events.sort((a, b) => a.rank - b.rank);
  }

  getEventName(id: string): string {
    const name = events.find(event => event.id === id)?.name;
    return name ? name : "";
  };

}

export interface CompEvent {
  id: string;
  name: string;
  rank: number;
}