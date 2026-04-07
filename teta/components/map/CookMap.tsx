"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface Cook {
  id: string;
  name: string;
  address_hint: string | null;
  specialties: string[] | null;
  avg_rating: number;
  accepts_orders: boolean;
  lng: number;
  lat: number;
}

interface CookMapProps {
  cooks: Cook[];
  onCookClick: (cookId: string) => void;
}

export default function CookMap({ cooks, onCookClick }: CookMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [35.5018, 33.8938], // Beirut
      zoom: 13,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      "top-right"
    );

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach((m) => m.remove());
    markers.current = [];

    cooks.forEach((cook) => {
      const el = document.createElement("div");
      el.className = "cook-marker";
      el.style.width = "32px";
      el.style.height = "32px";
      el.style.borderRadius = "50%";
      el.style.border = "3px solid white";
      el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
      el.style.cursor = "pointer";
      el.style.backgroundColor = cook.accepts_orders ? "#1D9E75" : "#9ca3af";

      const popup = new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(`
        <div style="font-family: Inter, sans-serif; padding: 4px;">
          <p style="font-weight: 600; margin: 0 0 2px;">${cook.name}</p>
          ${cook.address_hint ? `<p style="font-size: 12px; color: #666; margin: 0 0 2px;">📍 ${cook.address_hint}</p>` : ""}
          ${cook.specialties?.length ? `<p style="font-size: 11px; color: #888; margin: 0;">${cook.specialties.slice(0, 3).join(" · ")}</p>` : ""}
          ${cook.avg_rating > 0 ? `<p style="font-size: 12px; margin: 4px 0 0;">⭐ ${cook.avg_rating}</p>` : ""}
        </div>
      `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([cook.lng, cook.lat])
        .setPopup(popup)
        .addTo(map.current!);

      el.addEventListener("click", () => {
        onCookClick(cook.id);
      });

      markers.current.push(marker);
    });
  }, [cooks, onCookClick]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-full rounded-xl overflow-hidden"
    />
  );
}
