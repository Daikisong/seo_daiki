import { permanentRedirect } from "next/navigation";

const publicHomePath = process.env.NEXT_PUBLIC_PUBLIC_HOME_PATH ?? "/jp/ja/reviews/";

export default function HomePage() {
  permanentRedirect(publicHomePath);
}
