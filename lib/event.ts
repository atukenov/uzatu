export const event = {
  brideName: 'Нұрай',
  ceremonyTitle: 'Ұядан ұшқан күн',
  dateISO: '2026-10-23T18:00:00',
  dateLine: '23 қазан, 2026 жыл',
  timeLine: 'Сағат 18:00',
  calendarMonthLabel: 'Қазан 2026',
  calendarDay: 23,
  venueName: 'Атамұра',
  venueLine: 'мейрамханасы',
  venueDistrict: 'Махамбет ауданы',
  mapUrl:
    'https://2gis.kz/atyrau/search/%D0%B0%D1%82%D0%B0%D0%BC%D1%83%D1%80%D0%B0%20%D1%80%D0%B5%D1%81%D1%82%D0%BE%D1%80%D0%B0%D0%BD/geo/70030077131277612/51.583544%2C47.675258?m=51.583942%2C47.676526%2F17.81',
  hostNames: 'Қайрат & Роза',
  verseLines: [
    'Шаңырақтың шырағысың, шаттығы,',
    'Текті жердің тұяғысың, ақ гүлі.',
    'Мың жыл құда болуға да атты күн,',
    'Екі жасқа құдай берсін бақ бүгін.',
  ],
  greetingHeading: 'Құрметті қонақтар!',
  greetingParagraph:
    'Аяулы қызымыз Нұрайдың аялы алақанымыздан құтты босағасына шығарып салу рәсіміне арналған салтанатты тойымызға шақырамыз',
  closingLine: 'Сіздің келуіңіз — біздің қуанышымыз',
} as const;

export type RsvpChoice = 'alone' | 'spouse' | 'no';

export const RSVP_CHOICES: { value: RsvpChoice; label: string }[] = [
  { value: 'alone', label: 'Ия, әрине келемін' },
  { value: 'spouse', label: 'Жұбайыммен келемін' },
  { value: 'no', label: 'Өкінішке орай, келе алмаймын' },
];
