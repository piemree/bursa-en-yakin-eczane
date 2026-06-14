import L from "leaflet";

function createPharmacyIcon(active: boolean): L.DivIcon {
  const size = active ? 32 : 24;
  const className = active ? "eczane-pin eczane-pin--active" : "eczane-pin";

  return L.divIcon({
    className,
    html: `<img src="/eczane-logo.png" alt="" width="${size}" height="${size}" draggable="false" />`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size + 4],
  });
}

export const pharmacyIcon = createPharmacyIcon(false);
export const pharmacyIconActive = createPharmacyIcon(true);

export const userIcon = L.divIcon({
  className: "user-pin",
  html: `<div class="user-pin-dot"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

export function getPharmacyIcon(selected: boolean): L.DivIcon {
  return selected ? pharmacyIconActive : pharmacyIcon;
}
