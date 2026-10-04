import { difference, intersection } from 'lodash';

export function prepareUpdatedImages(dbImages: string[], dtoImages?: string[]) {
	if (dtoImages === undefined) {
		return {
			updatedImages: [...dbImages],
			removedImages: [],
		};
	}

	const dtoImagesArray = dtoImages
		.flatMap(img =>
			typeof img === 'string' && img.includes(',') ? img.split(',') : img,
		)
		.map(s => s.trim())
		.filter(Boolean);

	return {
		updatedImages: intersection(dbImages, dtoImagesArray),
		removedImages: difference(dbImages, dtoImagesArray),
	};
}
