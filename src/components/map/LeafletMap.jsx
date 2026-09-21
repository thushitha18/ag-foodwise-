"use client";

import React, { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { UrgencyLevel } from "@/types";
import { DEFAULT_LOCATION } from "@/lib/distance";

const createDivIcon = (color, emoji) => {
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="
        background: ${color};
        width: 34px;
        height: 34px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      ">
        <span style="transform: rotate(45deg); font-size: 15px;">${emoji}</span>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  });
};

export default function LeafletMap({
  listings,
  rescuePartners,
  selectedFilter,
}) {
  const containerRef = useRef(null);
  const mapInstance = useRef(null);
  const markersLayer = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapInstance.current) {
      const map = L.map(containerRef.current).setView(
        [DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude],
        13
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      markersLayer.current = L.layerGroup().addTo(map);
      mapInstance.current = map;
    }

    // Refresh markers
    if (markersLayer.current) {
      markersLayer.current.clearLayers();

      const urgentIcon = createDivIcon("#e11d48", "⚡");
      const normalIcon = createDivIcon("#059669", "🥗");
      const ngoIcon = createDivIcon("#4f46e5", "🤝");

      // Add Food Listings
      listings.forEach((listing) => {
        const lat = listing.latitude ?? listing.provider?.lat;
        const lng = listing.longitude ?? listing.provider?.lng;
        if (!lat || !lng) return;

        const isUrgent =
          listing.urgencyLevel === UrgencyLevel.URGENT ||
          listing.urgency_level === UrgencyLevel.URGENT;
        const marker = L.marker([lat, lng], {
          icon: isUrgent ? urgentIcon : normalIcon,
        });

        const popupContent = `
          <div style="font-family: sans-serif; padding: 4px; max-width: 200px;">
            <div style="font-size: 10px; font-weight: bold; color: ${isUrgent ? '#e11d48' : '#059669'}; margin-bottom: 2px;">
              ${isUrgent ? '⚡ URGENT SURPLUS' : '🥗 FRESH SURPLUS'}
            </div>
            <h4 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 700; color: #0f172a;">
              ${listing.title || listing.food_name}
            </h4>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">
              ${listing.provider?.name || 'Local Kitchen'} • ${listing.quantity} ${listing.unit} left
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 6px;">
              <span style="font-weight: 800; color: #059669; font-size: 14px;">
                🆓 FREE
              </span>
              <a href="/food/${listing.id}" style="
                background: #059669;
                color: white;
                text-decoration: none;
                padding: 4px 8px;
                border-radius: 6px;
                font-size: 11px;
                font-weight: 600;
              ">Claim Free →</a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        markersLayer.current?.addLayer(marker);
      });

      // Add Rescue Partners if filter allows
      if (selectedFilter === "ALL" || selectedFilter === "RESCUE") {
        rescuePartners.forEach((ngo) => {
          if (!ngo.lat || !ngo.lng) return;
          const marker = L.marker([ngo.lat, ngo.lng], { icon: ngoIcon });
          const popupContent = `
            <div style="font-family: sans-serif; padding: 4px; max-width: 200px;">
              <div style="font-size: 10px; font-weight: bold; color: #4f46e5; margin-bottom: 2px;">
                🤝 RESCUE PARTNER NGO
              </div>
              <h4 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 700; color: #0f172a;">
                ${ngo.name}
              </h4>
              <p style="margin: 0 0 6px 0; font-size: 11px; color: #64748b;">
                ${ngo.address}
              </p>
              <div style="font-size: 11px; color: #059669; font-weight: 600; margin-bottom: 6px;">
                ${ngo.beneficiariesServedCount.toLocaleString()} individuals served
              </div>
              <a href="/rescue" style="
                display: block;
                text-align: center;
                background: #4f46e5;
                color: white;
                text-decoration: none;
                padding: 4px 8px;
                border-radius: 6px;
                font-size: 11px;
                font-weight: 600;
              ">Open Rescue Hub →</a>
            </div>
          `;
          marker.bindPopup(popupContent);
          markersLayer.current?.addLayer(marker);
        });
      }
    }
  }, [listings, rescuePartners, selectedFilter]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[600px] rounded-2xl overflow-hidden shadow-sm z-10"
    />
  );
}
