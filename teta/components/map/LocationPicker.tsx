"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface LocationPickerProps {
  initialLng?: number;
  initialLat?: number;
  onLocationChange: (lng: number, lat: number) => void;
}

export default function LocationPicker({
  initialLng = 35.5018,
  initialLat = 33.8938,
  onLocationChange,
}: LocationPickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [initialLng, initialLat],
      zoom: 13,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    marker.current = new mapboxgl.Marker({
      color: "#1D9E75",
      draggable: true,
    })
      .setLngLat([initialLng, initialLat])
      .addTo(map.current);

    marker.current.on("dragend", () => {
      const lngLat = marker.current!.getLngLat();
      onLocationChange(lngLat.lng, lngLat.lat);
      reverseGeocode(lngLat.lng, lngLat.lat);
    });

    map.current.on("click", (e) => {
      marker.current!.setLngLat(e.lngLat);
      onLocationChange(e.lngLat.lng, e.lngLat.lat);
      reverseGeocode(e.lngLat.lng, e.lngLat.lat);
    });

    reverseGeocode(initialLng, initialLat);

    return () => {
      map.current?.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function reverseGeocode(lng: number, lat: number) {
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&types=neighborhood,locality,place`
      );
      const data = await res.json();
      if (data.features?.length > 0) {
        setAddress(data.features[0].place_name);
      }
    } catch {
      // Geocoding is optional, fail silently
    }
  }

  return (
    <div className="space-y-2">
      <div
        ref={mapContainer}
        className="w-full h-64 rounded-xl overflow-hidden border border-foreground/10"
      />
      {address && (
        <p className="text-xs text-foreground/50 px-1">
          📍 {address}
        </p>
      )}
      <p className="text-xs text-foreground/40 px-1">
        Tap or drag the pin to your approximate location. We won&apos;t show your
        exact address.
      </p>
    </div>
  );
}
