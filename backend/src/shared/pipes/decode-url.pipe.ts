import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class DecodeUrlPipe implements PipeTransform {
	transform(value: string) {
		if (!value) return value;

		try {
			return decodeURIComponent(value);
		} catch (e) {
			return value;
		}
	}
}
