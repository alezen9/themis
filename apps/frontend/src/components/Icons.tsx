import { ComponentPropsWithRef } from "react";

export const IconCube = (props: ComponentPropsWithRef<"svg">) => {
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

export const IconCloud = (props: ComponentPropsWithRef<"svg">) => {
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

export const IconIBeam = (props: ComponentPropsWithRef<"svg">) => {
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
      <path d="M1 1H14.75M28.5 1H14.75M28.5 26H14.75M1 26H14.75M14.75 26V1" />
    </svg>
  );
};
