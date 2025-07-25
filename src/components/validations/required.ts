import { $, type QRL } from '@builder.io/qwik';
import type { FieldValue, Maybe } from './types';

type Value<TFieldValue extends FieldValue> = Maybe<TFieldValue> | number[];

/**
 * Creates a validation function that checks the existence of an input.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function required<TFieldValue extends FieldValue>(
  error: string
): QRL<(value: Value<TFieldValue>) => string> {
  return $((value: Value<TFieldValue>) =>
    (!value && value !== 0) || (Array.isArray(value) && !value.length)
      ? error
      : ''
  );
}
