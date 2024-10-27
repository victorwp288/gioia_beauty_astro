import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Map = ({ latitude, longitude }) => {
  useEffect(() => {
    // Dynamically import 'leaflet' inside useEffect
    import("leaflet").then((L) => {
      // Fix for the default marker icon issue
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    });
  }, []);

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={16}
      style={{
        height: "100%",
        width: "100%",
        marginTop: "2rem",
        paddingBottom: "15rem",
        zIndex: 5,
        position: "relative",
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Marker position={[latitude, longitude]}>
        <Popup>Ci trovi qui.</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
