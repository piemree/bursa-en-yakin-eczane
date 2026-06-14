import type { Eczane } from "@/lib/types";

interface EczaneSeoListProps {
  eczaneler: Eczane[];
}

export function EczaneSeoList({ eczaneler }: EczaneSeoListProps) {
  return (
    <ul className="sr-only">
      {eczaneler.map((eczane) => (
        <li key={eczane.id}>
          {eczane.name} - {eczane.district} - {eczane.address}
          {eczane.phones[0] ? ` - ${eczane.phones[0]}` : ""}
        </li>
      ))}
    </ul>
  );
}
