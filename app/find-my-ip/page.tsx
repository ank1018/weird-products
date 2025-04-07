import { pageMetadata } from "../metadata";
import FindMyIp from "./find-my-ip.view";

export const metadata = {
  ...pageMetadata.findMyIp,
  openGraph: {
    title: pageMetadata.findMyIp.title,
    description: pageMetadata.findMyIp.description,
    images: [
      // {
      //   url: '/static/images/ip-address-preview.png',
      //   width: 1200,
      //   height: 630,
      //   alt: 'IP Address Lookup Tool Preview',
      // }
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  authors: [{ name: "Weird Products" }],
  alternates: {
    canonical: pageMetadata.findMyIp.canonical,
  },
};

export default function FindMyIpPage() {
  return <FindMyIp />;
}