export type DeliveryZone = { id: string; name: string; detail: string; fee: number };

export const deliveryZones: DeliveryZone[] = [
  { id: '1', name: 'Nairobi CBD', detail: 'Central Business District, Nairobi', fee: 150 },
  { id: '2', name: 'Westlands', detail: 'Westlands, Nairobi', fee: 150 },
  { id: '3', name: 'Kilimani', detail: 'Kilimani, Nairobi', fee: 150 },
  { id: '4', name: 'Kileleshwa', detail: 'Kileleshwa, Nairobi', fee: 150 },
  { id: '5', name: 'Lavington', detail: 'Lavington, Nairobi', fee: 200 },
  { id: '6', name: 'Karen', detail: 'Karen, Nairobi', fee: 250 },
  { id: '7', name: 'Langata', detail: 'Langata Road, Nairobi', fee: 200 },
  { id: '8', name: 'Eastleigh', detail: 'Eastleigh, Nairobi', fee: 150 },
  { id: '9', name: 'Mombasa', detail: 'Mombasa Island & suburbs', fee: 400 },
  { id: '10', name: 'Kisumu', detail: 'Kisumu town', fee: 450 },
  { id: '11', name: 'Nakuru', detail: 'Nakuru town', fee: 400 },
  { id: '12', name: 'Eldoret', detail: 'Eldoret town', fee: 450 },
  { id: '13', name: 'Thika', detail: 'Thika town', fee: 250 },
  { id: '14', name: 'Kiambu', detail: 'Kiambu town', fee: 200 },
  { id: '15', name: 'Rongai', detail: 'Ongata Rongai, Kajiado', fee: 250 },
];

export const FREE_DELIVERY_THRESHOLD = 3000;
