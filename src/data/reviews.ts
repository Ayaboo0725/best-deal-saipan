// REAL customer reviews only — paste verbatim from Google Business (with the
// reviewer's public display name and date). Never write or edit reviews.
// While this list is empty the site shows a "Read / Write a Google review" band.
export type Review = { author: string; rating: 1 | 2 | 3 | 4 | 5; text: string; source: 'Google'; date?: string };

export const REVIEWS: Review[] = [];
