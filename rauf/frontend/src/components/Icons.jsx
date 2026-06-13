import React from "react";

const IconWrapper = ({
  size = 24,
  color = "currentColor",
  children,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {children}
  </svg>
);

export const VideoIcon = (props) => (
  <IconWrapper {...props}>
    <path d="m22 8-6 4 6 4V8Z" />
    <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
  </IconWrapper>
);

export const StethoscopeIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
    <path d="M8 15v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4" />
    <circle cx="16" cy="11" r="2" />
  </IconWrapper>
);

export const CreditCardIcon = (props) => (
  <IconWrapper {...props}>
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </IconWrapper>
);

export const CalendarIcon = (props) => (
  <IconWrapper {...props}>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="22" y1="10" y2="10" />
  </IconWrapper>
);

export const PillIcon = (props) => (
  <IconWrapper {...props}>
    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
    <path d="m8.5 8.5 7 7" />
  </IconWrapper>
);

export const MedicalReportIcon = (props) => (
  <IconWrapper {...props}>
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M9 14h6" />
    <path d="M12 17v-6" />
  </IconWrapper>
);

export const PrizeIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978" />
    <path d="M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978" />
    <path d="M18 9h1.5a1 1 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z" />
    <path d="M6 9H4.5a1 1 0 0 1 0-5H6" />
  </IconWrapper>
);

export const BellIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M10.268 21a2 2 0 0 0 3.464 0" />
    <path d="M22 8c0-2.3-.8-4.3-2-6" />
    <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
    <path d="M4 2C2.8 3.7 2 5.7 2 8" />
  </IconWrapper>
);

export const FollowUpIcon = (props) => (
  <IconWrapper {...props}>
    <path d="m2 9 3-3 3 3" />
    <path d="M13 18H7a2 2 0 0 1-2-2V6" />
    <path d="m22 15-3 3-3-3" />
    <path d="M11 6h6a2 2 0 0 1 2 2v10" />
  </IconWrapper>
);

export const PawIcon = (props) => (
  <IconWrapper {...props}>
    <circle cx="11" cy="4" r="2" />
    <circle cx="18" cy="8" r="2" />
    <circle cx="20" cy="16" r="2" />
    <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" />
  </IconWrapper>
);

export const StarIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
  </IconWrapper>
);

export const SnapchatIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M23.914 17.289c-.166-.455-.484-.698-.846-.899-.06-.034-.124-.067-.184-.096l-.329-.166c-1.128-.599-2.008-1.353-2.619-2.247-.165-.24-.298-.535-.45-.796-.051-.15-.048-.234-.012-.31.054-.083.102-.122.145-.15.194-.129.393-.26.528-.347.243-.156.434-.28.556-.367.464-.324.788-.669.99-1.053.15-.362.158-.813.104-1.74-.308-.807-1.07-1.308-1.994-1.308-.244 0-.485.034-.73.098.009-.552-.003-1.135-.053-1.708-.174-2.016-.88-3.072-1.615-3.915a6.45 6.45 0 0 0-1.643-1.322C14.646.324 13.38 0 12 0S9.354.324 8.248.961c-.618.348-1.173.795-1.645 1.325-.735.843-1.44 1.9-1.616 3.915-.05.573-.06 1.158-.054 1.707-.245-.064-.486-.098-.73-.098-.923 0-1.686.502-1.992 1.31a2.1 2.1 0 0 0 .1 1.74c.204.385.528.73.99 1.052.123.087.315.21.557.369l.508.331c.063.04.122.1.164.166.039.08.04.165-.018.325a5.1 5.1 0 0 1-.443.78c-.597.875-1.452 1.615-2.544 2.208-.578.306-1.179.51-1.433 1.2-.192.522-.066 1.114.42 1.612q.27.284.614.465a6.6 6.6 0 0 0 1.5.6c.092.029.198.077.303.135.177.156.153.39.388.732q.18.267.444.45c.495.344 1.052.365 1.643.387.532.021 1.137.045 1.825.27.285.096.584.279.927.492.825.507 1.958 1.203 3.849 1.203 1.893 0 3.03-.699 3.864-1.209.34-.21.636-.39.914-.482.69-.228 1.294-.252 1.827-.272.59-.022 1.146-.045 1.642-.387a1.71 1.71 0 0 0 .504-.552c.171-.288.165-.49.326-.63a.9.9 0 0 1 .285-.13 6.75 6.75 0 0 0 1.52-.606c.24-.13.46-.3.644-.504l.006-.008c.456-.488.57-1.064.384-1.57" />
    <path d="M22.233 18.192c-1.026.567-1.708.505-2.24.847-.45.29-.183.915-.51 1.14-.403.279-1.591-.018-3.127.489-1.268.419-2.076 1.623-4.356 1.623s-3.068-1.202-4.356-1.626c-1.533-.507-2.724-.21-3.126-.488-.327-.225-.062-.852-.511-1.141-.531-.342-1.214-.28-2.238-.845-.654-.36-.284-.585-.066-.696 3.717-1.798 4.31-4.575 4.335-4.782.033-.249.068-.445-.207-.699-.266-.246-1.443-.975-1.77-1.203-.54-.378-.78-.755-.603-1.218.123-.321.422-.443.735-.443q.147 0 .296.033c.594.129 1.17.428 1.503.507q.06.015.123.016c.177 0 .24-.09.228-.292-.039-.65-.13-1.916-.028-3.1.14-1.626.666-2.433 1.288-3.146.3-.343 1.706-1.83 4.395-1.83 2.688 0 4.098 1.48 4.397 1.822.624.713 1.15 1.52 1.288 3.147.102 1.182.014 2.448-.028 3.098-.015.213.05.292.228.292q.06 0 .123-.015c.333-.081.91-.38 1.503-.507q.149-.035.296-.035c.315 0 .614.123.735.443.176.463-.06.84-.602 1.218-.327.228-1.505.957-1.77 1.203-.276.254-.24.45-.208.699.027.21.62 2.987 4.335 4.784.22.11.59.333-.062.696" />
  </IconWrapper>
);

export const XIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </IconWrapper>
);

export const YouTubeIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M2.5 12a9.5 9.5 0 1 1 19 0 9.5 9.5 0 1 1-19 0" />
    <path d="m10 15 5-3-5-3v6Z" />
  </IconWrapper>
);

export const InstagramIcon = (props) => (
  <IconWrapper {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </IconWrapper>
);

export const LocationIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M18 8c0 3.613-3.869 7.429-5.393 8.795a1 1 0 0 1-1.214 0C9.87 15.429 6 11.613 6 8a6 6 0 0 1 12 0" />
    <circle cx="12" cy="8" r="2" />
    <path d="M8.714 14h-3.71a1 1 0 0 0-.948.683l-2.004 6A1 1 0 0 0 3 22h18a1 1 0 0 0 .948-1.316l-2-6a1 1 0 0 0-.949-.684h-3.712" />
  </IconWrapper>
);

export const PhoneIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
  </IconWrapper>
);

export const EmailIcon = (props) => (
  <IconWrapper {...props}>
    <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
    <rect x="2" y="4" width="20" height="16" rx="2" />
  </IconWrapper>
);

export const CalendarClockIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M16 14v2.2l1.6 1" />
    <path d="M16 2v4" />
    <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" />
    <path d="M3 10h5" />
    <path d="M8 2v4" />
    <circle cx="16" cy="16" r="6" />
  </IconWrapper>
);

export const VarifiedIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </IconWrapper>
);

export const QuickIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
  </IconWrapper>
);

export const LockIcon = (props) => (
  <IconWrapper {...props}>
    <circle cx="12" cy="16" r="1" />
    <rect x="3" y="10" width="18" height="12" rx="2" />
    <path d="M7 10V7a5 5 0 0 1 10 0v3" />
  </IconWrapper>
);

export const ErrorIcon = (props) => (
  <IconWrapper {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M4.929 4.929 19.07 19.071" />
  </IconWrapper>
);

export const VetIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M11 2v2" />
    <path d="M5 2v2" />
    <path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1" />
    <path d="M8 15a6 6 0 0 0 12 0v-3" />
    <circle cx="20" cy="10" r="2" />
  </IconWrapper>
);

export const GiftIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M12 7v14" />
    <path d="M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
    <path d="M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5" />
    <rect x="3" y="7" width="18" height="4" rx="1" />
  </IconWrapper>
);

export const CatIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z" />
    <path d="M8 14v.5" />
    <path d="M16 14v.5" />
    <path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
  </IconWrapper>
);

export const UserIcon = (props) => (
  <IconWrapper {...props}>
    <circle cx="12" cy="8" r="5" />
    <path d="M20 21a8 8 0 0 0-16 0" />
  </IconWrapper>
);

export const LogoutIcon = (props) => (
  <IconWrapper {...props}>
    <path d="m16 17 5-5-5-5" />
    <path d="M21 12H9" />
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
  </IconWrapper>
);

export const PencilIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
    <path d="m15 5 4 4" />
  </IconWrapper>
);

export const CheckIcon = (props) => (
  <IconWrapper {...props}>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="m9 12 2 2 4-4" />
  </IconWrapper>
);

export const DeleteIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </IconWrapper>
);

export const LanguageIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54" />
    <path d="M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17" />
    <path d="M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05" />
    <circle cx="12" cy="12" r="10" />
  </IconWrapper>
);
