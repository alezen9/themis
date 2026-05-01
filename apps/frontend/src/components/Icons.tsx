import { ComponentPropsWithoutRef } from "react";

export const IconCube = (props: ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg
      width="28"
      height="32"
      viewBox="0 0 28 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
      {...props}
    >
      <path d="M0.75 8.20134V23.0577L13.75 30.75M0.75 8.20134L13.75 0.75L26.75 8.20134M0.75 8.20134L13.75 15.75M13.75 30.75L26.75 23.0577V8.20134M13.75 30.75V15.75M26.75 8.20134L13.75 15.75" />
    </svg>
  );
};

export const IconCloud = (props: ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg
      width="32"
      height="24"
      viewBox="0 0 32 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
      {...props}
    >
      <path d="M7.76398 22.75C-3.87054 21.4496 0.831257 9.75438 8.45055 11.2298M10.9906 12.1905C10.1213 11.6988 9.26911 11.3883 8.45055 11.2298M8.45055 11.2298C5.07918 -1.24945 23.868 -2.68927 24.6839 7.47798M23.868 22.75C36.2149 18.9104 30.3098 4.03042 19.0366 7.86972M12.0579 22.75H19.5734" />
    </svg>
  );
};

export const IconIBeam = (props: ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg
      width="30"
      height="27"
      viewBox="0 0 30 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
      {...props}
    >
      {/* <path d="M1 1H14.75M28.5 1H14.75M28.5 26H14.75M1 26H14.75M14.75 26V1" /> */}
      <path d="M1 1H11.25M28.5 1H18.25M28.5 26H18.25M1 26H11.25M14.75 4.5L18.25 1M14.75 4.5L11.25 1M14.75 4.5V22.5M18.25 1H14.75H11.25M14.75 22.5L18.25 26M14.75 22.5L11.25 26M18.25 26H14.75H11.25" />
    </svg>
  );
};

export const IconRHSBeam = (props: ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg
      width="22"
      height="27"
      viewBox="0 0 22 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
      {...props}
    >
      <rect x="1" y="1" width="20" height="25" rx="2" />
    </svg>
  );
};

export const IconCHSBeam = (props: ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 27 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
      {...props}
    >
      <circle cx="13.5" cy="13.5" r="12.5" />
    </svg>
  );
};

export const IconMagnifier = (props: ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <path d="m31.707 30.282-9.717-9.776c1.811-2.169 2.902-4.96 2.902-8.007 0-6.904-5.596-12.5-12.5-12.5s-12.5 5.596-12.5 12.5 5.596 12.5 12.5 12.5c3.136 0 6.002-1.158 8.197-3.067l9.703 9.764c.39.39 1.024.39 1.415 0s.39-1.023 0-1.415zm-19.314-7.266c-5.808 0-10.517-4.709-10.517-10.517S6.584 1.982 12.393 1.982c5.808 0 10.516 4.708 10.516 10.517S18.2 23.016 12.392 23.016z" />
    </svg>
  );
};

export const IconChevron = (props: ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
};
