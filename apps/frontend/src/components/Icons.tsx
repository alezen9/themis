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

export const IconInfo = (props: ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
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
      <path d="M12 2.75c-.9785 0-1.8129.62503-2.12213 1.49993-.13804.39054-.56653.59524-.95707.4572s-.59523-.56653-.45719-.95706C8.97804 2.29459 10.3661 1.25 12 1.25c1.634 0 3.022 1.04459 3.5365 2.50007.138.39053-.0667.81902-.4572.95706-.3906.13804-.8191-.06666-.9571-.4572C13.813 3.37503 12.9785 2.75 12 2.75ZM2.75 6c0-.41421.33579-.75.75-.75h17.0001c.4142 0 .75.33579.75.75s-.3358.75-.75.75H3.5c-.41421 0-.75-.33579-.75-.75Zm3.16508 2.45011c-.02755-.4133-.38493-.726-.79822-.69845-.4133.02755-.72601.38493-.69845.79823l.46345 6.95171c.08549 1.2828.15455 2.3189.31652 3.132.1684.8453.45482 1.5514 1.04642 2.1048.59159.5535 1.31514.7923 2.16979.9041.82204.1075 1.86051.1075 3.14611.1075h.8788c1.2856 0 2.324 0 3.1461-.1075.8546-.1118 1.5782-.3506 2.1698-.9041.5916-.5534.878-1.2595 1.0464-2.1048.1619-.8131.231-1.8492.3165-3.132l.4635-6.95171c.0275-.4133-.2852-.77068-.6985-.79823-.4133-.02755-.7707.28515-.7982.69845l-.46 6.89909c-.0898 1.3479-.1539 2.2857-.2944 2.9913-.1364.6845-.3267 1.0468-.6001 1.3026-.2734.2557-.6476.4216-1.3396.5121-.7134.0933-1.6534.0948-3.0042.0948h-.7734c-1.3508 0-2.29085-.0015-3.00425-.0948-.692-.0905-1.06616-.2564-1.33958-.5121-.27341-.2558-.46374-.6181-.60009-1.3026-.14057-.7056-.2046-1.6434-.29445-2.9913l-.45995-6.89909Z" />
      <path d="M9.42546 10.2537c.41216-.0412.77964.2595.82094.6717l.5 5c.0412.4121-.2595.7797-.6717.8209-.41214.0412-.77968-.2595-.82089-.6717l-.5-5c-.04122-.4121.25949-.7797.67165-.8209Zm5.82094.8209c.0412-.4121-.2595-.7797-.6717-.8209-.4121-.0412-.7797.2595-.8209.6717l-.5 5c-.0412.4121.2595.7797.6717.8209.4121.0412.7796-.2595.8209-.6717l.5-5Z" />
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
