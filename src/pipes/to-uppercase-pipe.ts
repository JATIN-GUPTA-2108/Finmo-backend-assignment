import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ToUpperCasePipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (value.currency) {
            value.currency = value.currency.toUpperCase();
        }
        return value;
    }
}