import { ComponentPropsWithoutRef, useId } from "react";

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
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
      transform="scale(0.8)"
      {...props}
    >
      <path d="M28.2929 29.7071C28.6834 30.0976 29.3166 30.0976 29.7071 29.7071C30.0976 29.3166 30.0976 28.6834 29.7071 28.2929L29 29L28.2929 29.7071ZM25.6452 14.3226H24.6452C24.6452 20.0236 20.0236 24.6452 14.3226 24.6452V25.6452V26.6452C21.1282 26.6452 26.6452 21.1282 26.6452 14.3226H25.6452ZM14.3226 25.6452V24.6452C8.62158 24.6452 4 20.0236 4 14.3226H3H2C2 21.1282 7.51701 26.6452 14.3226 26.6452V25.6452ZM3 14.3226H4C4 8.62158 8.62158 4 14.3226 4V3V2C7.51701 2 2 7.51701 2 14.3226H3ZM14.3226 3V4C20.0236 4 24.6452 8.62158 24.6452 14.3226H25.6452H26.6452C26.6452 7.51701 21.1282 2 14.3226 2V3ZM22.2903 22.2903L21.5832 22.9974L28.2929 29.7071L29 29L29.7071 28.2929L22.9974 21.5832L22.2903 22.2903Z" />
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

export const IconInfo = (props: ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      {...props}
    >
      <path
        d="M12 17v-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle
        cx="1"
        cy="1"
        r="1"
        transform="matrix(1 0 0 -1 11 9)"
        fill="currentColor"
      />
      <path
        d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2c5.5228 0 10 4.47715 10 10 0 5.5228-4.4772 10-10 10-5.52285 0-10-4.4772-10-10 0-1.8214.48697-3.52913 1.33782-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const IconGraph = (props: ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg
      viewBox="0 0 27 27"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
      {...props}
    >
      <path d="M7 20.75C8.38071 20.75 9.5 19.6307 9.5 18.25C9.5 16.8693 8.38071 15.75 7 15.75C5.61929 15.75 4.5 16.8693 4.5 18.25C4.5 19.6307 5.61929 20.75 7 20.75Z" />
      <path d="M18.25 9.5C20.3211 9.5 22 7.82107 22 5.75C22 3.67893 20.3211 2 18.25 2C16.1789 2 14.5 3.67893 14.5 5.75C14.5 7.82107 16.1789 9.5 18.25 9.5Z" />
      <path d="M20.75 25.75C23.5114 25.75 25.75 23.5114 25.75 20.75C25.75 17.9886 23.5114 15.75 20.75 15.75C17.9886 15.75 15.75 17.9886 15.75 20.75C15.75 23.5114 17.9886 25.75 20.75 25.75Z" />
      <path d="M3.25 5.75C4.63071 5.75 5.75 4.63071 5.75 3.25C5.75 1.86929 4.63071 0.75 3.25 0.75C1.86929 0.75 0.75 1.86929 0.75 3.25C0.75 4.63071 1.86929 5.75 3.25 5.75Z" />
      <path d="M15.7501 20.75L9.19727 19.4395" />
      <path d="M19.4492 9.30005L21.0959 15.7709" />
      <path d="M5.75 3.25L14.7051 4.5293" />
      <path d="M6.67983 15.7707C6.99971 15.7499 3.69922 5.70898 3.69922 5.70898" />
    </svg>
  );
};

export const IconEdit = (props: ComponentPropsWithoutRef<"svg">) => {
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
      <path d="m21.2799 6.40005-9.54 9.53995c-.95.95-3.77003 1.39-4.40003.76-.63-.63-.2-3.45.75-4.4l9.55003-9.54998c.2355-.25694.5206-.46348.8382-.60718.3175-.1437.6609-.2216 1.0094-.22894.3484-.00733.6948.05601 1.0181.18622.3233.13021.6169.32461.863.57141.2461.2468.4397.5409.569.86456.1293.32367.1918.67017.1835 1.01862-.0083.34845-.0872.69164-.2317 1.00879-.1446.31715-.3519.60174-.6095.83655v0Z" />
      <path d="M11 4H6c-1.06087 0-2.07822.42142-2.82837 1.17157C2.42149 5.92172 2 6.93913 2 8v10c0 1.0609.42149 2.0783 1.17163 2.8284C3.92178 21.5786 4.93913 22 6 22h11c2.21 0 3-1.8 3-4v-5" />
    </svg>
  );
};

export const IconDelete = (props: ComponentPropsWithoutRef<"svg">) => {
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
      <path d="M9.1709 4c.41183-1.16519 1.5231-2 2.8293-2s2.4175.83481 2.8293 2m5.6706 2H3.5m15.3332 2.5-.46 6.8991c-.177 2.6549-.2655 3.9824-1.1305 4.7916C16.3777 21 15.0473 21 12.3865 21h-.7733c-2.66085 0-3.99125 0-4.85626-.8093-.865-.8092-.9535-2.1367-1.1305-4.7916L5.1665 8.5M9.5 11l.5 5m4.5-5-.5 5" />
    </svg>
  );
};

const europeanUnionStarPath =
  "M0-25.284 5.947-8.186 24.047-7.814 9.619 3.125 14.862 20.358 0 10.111-14.862 20.358-9.619 3.125-24.047-7.814-5.947-8.186Z";

export const IconFlagEuropeanUnion = (
  props: ComponentPropsWithoutRef<"svg">,
) => {
  const starId = useId();

  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      {...props}
    >
      <path d="M0 0h512v512H0V0Z" fill="#039" />
      <defs>
        <path id={starId} d={europeanUnionStarPath} />
      </defs>
      <g fill="#FC0">
        <use href={`#${starId}`} transform="translate(256 106.696)" />
        <use href={`#${starId}`} transform="translate(329.991 128.166)" />
        <use href={`#${starId}`} transform="translate(386.234 184.409)" />
        <use href={`#${starId}`} transform="translate(407.704 258.4)" />
        <use href={`#${starId}`} transform="translate(386.206 336.477)" />
        <use href={`#${starId}`} transform="translate(331.331 387.368)" />
        <use href={`#${starId}`} transform="translate(256 410.104)" />
        <use href={`#${starId}`} transform="translate(180.669 387.368)" />
        <use href={`#${starId}`} transform="translate(125.794 336.477)" />
        <use href={`#${starId}`} transform="translate(104.296 258.4)" />
        <use href={`#${starId}`} transform="translate(125.766 184.409)" />
        <use href={`#${starId}`} transform="translate(182.009 128.166)" />
      </g>
    </svg>
  );
};

export const IconFlagItaly = (props: ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      {...props}
    >
      <path d="M0 0h512v512H0V0Z" fill="#fff" />
      <path d="M0 0h170.7v512H0V0Z" fill="#009246" />
      <path d="M341.3 0H512v512H341.3V0Z" fill="#CE2B37" />
    </svg>
  );
};

export const IconPlus = (props: ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
      {...props}
    >
      <path d="M4 12h16m-8-8v16" />
    </svg>
  );
};

export const IconPencil = (props: ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
      {...props}
    >
      <path d="M20.1497 7.93997 8.27971 19.81c-1.06 1.07-4.23 1.5599-5 .8499s-.21002-3.8799.84998-4.9499L15.9997 3.84c.5481-.52199 1.2786-.80903 2.0354-.79981.7568.00923 1.48.31399 2.0152.84919.5352.53519.84 1.25843.8492 2.01525.0093.75683-.2778 1.48726-.7998 2.03534zM21 21h-9" />
    </svg>
  );
};

export const IconImport = (props: ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 28 28"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
      {...props}
    >
      <path d="M0.75 18.7498C0.75 18.7498 0.75 20.9316 0.75 23.1134C0.75 25.2952 2.32576 26.7498 4.68939 26.7498C7.05303 26.7498 20.447 26.7498 22.8106 26.7498C25.1742 26.7498 26.75 25.2952 26.75 23.1134C26.75 20.9316 26.75 18.7498 26.75 18.7498" />
      <path d="M13.75 15.75L13.75 0.75M7.75 9.25657L13.75 15.75L19.75 9.25657" />
    </svg>
  );
};

export const IconExport = (props: ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 28 28"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
      {...props}
    >
      <path d="M0.75 18.75C0.75 18.75 0.75 20.9318 0.75 23.1136C0.75 25.2955 2.32576 26.75 4.68939 26.75C7.05303 26.75 20.447 26.75 22.8106 26.75C25.1742 26.75 26.75 25.2955 26.75 23.1136C26.75 20.9318 26.75 18.75 26.75 18.75" />
      <path d="M13.75 0.75L13.75 15.75M19.75 7.24343L13.75 0.75L7.75 7.24343" />
    </svg>
  );
};

export const IconImportPartial = (props: ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 28 28"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
      {...props}
    >
      <path d="M0.75 18.7498C0.75 18.7498 0.75 20.9316 0.75 23.1134C0.75 25.2952 2.32576 26.7498 4.68939 26.7498C7.05303 26.7498 20.447 26.7498 22.8106 26.7498C25.1742 26.7498 26.75 25.2952 26.75 23.1134C26.75 20.9316 26.75 18.7498 26.75 18.7498" />
      <path d="M13.75 15.75L13.75 0.75M7.75 9.25657L13.75 15.75L19.75 9.25657" />
      <rect x="11.75" y="19.75" width="4" height="4" fill="currentColor" />
    </svg>
  );
};

export const IconExportPartial = (props: ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 28 28"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
      {...props}
    >
      <path d="M0.75 18.75C0.75 18.75 0.75 20.9318 0.75 23.1136C0.75 25.2955 2.32576 26.75 4.68939 26.75C7.05303 26.75 20.447 26.75 22.8106 26.75C25.1742 26.75 26.75 25.2955 26.75 23.1136C26.75 20.9318 26.75 18.75 26.75 18.75" />
      <path d="M13.75 0.75L13.75 15.75M19.75 7.24343L13.75 0.75L7.75 7.24343" />
      <rect x="11.75" y="19.75" width="4" height="4" fill="currentColor" />
    </svg>
  );
};

export const IconClose = (props: ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      {...props}
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
};

export const IconCheck = (props: ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
};

export const IconWarning = (props: ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    </svg>
  );
};

export const IconQuestionMark = (props: ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9.14258 11.1595C9.16186 5.43136 15.969 1.67246 20.5711 5.82653C25.1733 9.9806 22.5994 16.4944 16.3807 18.3976V21.7144M16.3807 27.5409V27.1599" />
    </svg>
  );
};

export const IconBranch = (props: ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg
      viewBox="0 0 15 15"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2.5 4.5c-1.10457 0-2-.89543-2-2s.89543-2 2-2 2 .89543 2 2-.89543 2-2 2Zm0 0v6m2 2c0 1.1046-.89543 2-2 2s-2-.8954-2-2 .89543-2 2-2m2 2c0-1.1046-.89543-2-2-2m2 2h5c1.6569 0 3-1.3431 3-3v-2m0 0c-1.1046 0-2-.89543-2-2s.8954-2 2-2 2 .89543 2 2-.8954 2-2 2Z" />
    </svg>
  );
};

export const IconUndo = (props: ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 13c-.5096-1.0039-1.3753-1.8345-2.4666-2.3667-1.0914-.5322-2.3492-.73706-3.584-.5838C9.93127 10.3 8.52468 11.6116 7 12.8186M7 10v3h3" />
    </svg>
  );
};

export const IconRedo = (props: ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 13c.50963-1.0039 1.37532-1.8345 2.46665-2.3667 1.09132-.5322 2.34915-.73706 3.58395-.5838 2.0181.2505 3.4247 1.5621 4.9494 2.7691M17 10v3h-3" />
    </svg>
  );
};
