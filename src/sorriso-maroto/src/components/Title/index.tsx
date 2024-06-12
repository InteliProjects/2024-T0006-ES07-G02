import { ITitle } from "./interfaces/ITitle";

export const Title = ({ title }: ITitle) => (
  <div className="w-full bg-white rounded-lg">
    <p className="p-2 font-bold">{title}</p>
  </div>
);
