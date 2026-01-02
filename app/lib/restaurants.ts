export interface Restaurant {
  id: string
  name: string
  city: string
  gm: string
  status: 'active' | 'inactive'
}

export const restaurants: Restaurant[] = [
  { id: 'REST1', name: 'TUCCI', city: 'New York, NY', gm: 'GM Tucci', status: 'active' },
  { id: 'REST2', name: "DELMONICO'S", city: 'New York, NY', gm: 'GM Delmonico', status: 'active' },
  { id: 'REST3', name: 'SEI LESS', city: 'New York, NY', gm: 'GM Sei Less', status: 'active' },
  { id: 'REST4', name: 'HARBOR NYC', city: 'New York, NY', gm: 'GM Harbor', status: 'active' },
]
