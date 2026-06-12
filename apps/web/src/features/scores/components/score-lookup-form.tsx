import { Search } from 'lucide-react';
import type { Dispatch, FormEventHandler, SetStateAction } from 'react';

export function ScoreLookupForm({
  registrationNumber,
  fallbackRegistrationNumber,
  isLoading,
  onRegistrationNumberChange,
  onSubmit,
}: {
  readonly registrationNumber: string;
  readonly fallbackRegistrationNumber: string;
  readonly isLoading: boolean;
  readonly onRegistrationNumberChange: Dispatch<SetStateAction<string>>;
  readonly onSubmit: FormEventHandler<HTMLFormElement>;
}) {
  return (
    <form className="lookup-form lookup-form--wide" onSubmit={onSubmit}>
      <input
        inputMode="numeric"
        placeholder="Ví dụ: 01029384"
        value={registrationNumber || fallbackRegistrationNumber}
        onChange={(event) => onRegistrationNumberChange(event.target.value)}
      />
      <button type="submit" disabled={isLoading}>
        <Search size={17} aria-hidden="true" />
        {isLoading ? 'Đang tìm...' : 'Tra cứu'}
      </button>
    </form>
  );
}
