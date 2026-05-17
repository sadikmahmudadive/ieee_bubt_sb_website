"use client";

import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';


// Optional: you can use any icon from react-icons. Let's use a standard circle or calendar icon.
import { FaCalendarAlt, FaLightbulb, FaFlask, FaPenNib, FaTrophy } from "react-icons/fa";

type TimelineEntry = {
  phase: string;
  window: string;
  focus: string;
};

type ResearchTimelineProps = {
  timeline: TimelineEntry[];
};

export function ResearchTimeline({ timeline }: ResearchTimelineProps) {
  // Map icons based on the phase (just a nice visual touch)
  const getIcon = (phase: string) => {
    switch (phase) {
      case "Concept Brief":
        return <FaLightbulb />;
      case "Prototype & Data":
        return <FaFlask />;
      case "Manuscript Submission":
        return <FaPenNib />;
      case "Showcase & Impact":
        return <FaTrophy />;
      default:
        return <FaCalendarAlt />;
    }
  };

  return (
    <div className="w-full font-sans">
      <VerticalTimeline lineColor="#e2e8f0">
        {timeline.map((entry, index) => (
          <VerticalTimelineElement
            key={entry.phase}
            className="vertical-timeline-element--work"
            contentStyle={{ 
              background: "white", 
              color: "#0f172a", 
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
              borderRadius: "1rem",
              border: "1px solid #e2e8f0",
              padding: "2rem"
            }}
            contentArrowStyle={{ borderRight: "7px solid  #e2e8f0" }}
            date={entry.window}
            dateClassName="text-primary font-semibold tracking-wider uppercase text-sm px-2"
            iconStyle={{ background: "#0ea5e9", color: "#fff", boxShadow: "0 0 0 4px #bae6fd, inset 0 2px 0 rgba(0,0,0,.08), 0 3px 0 4px rgba(0,0,0,.05)" }}
            icon={getIcon(entry.phase)}
          >
            <h3 className="vertical-timeline-element-title text-xl font-bold text-slate-900 mb-2">
              {entry.phase}
            </h3>
            <p className="vertical-timeline-element-subtitle text-slate-600 text-sm leading-relaxed mt-2 font-normal">
              {entry.focus}
            </p>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </div>
  );
}
