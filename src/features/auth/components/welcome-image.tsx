import signInImage from "@/assets/images/sign-in-image.webp";

export const WelcomeImage = () => {
  return (
    <img
      src={signInImage}
      alt="Картинка страницы входа"
      className="rounded-4 h-full w-full flex-1 object-cover"
    />
  );
};
