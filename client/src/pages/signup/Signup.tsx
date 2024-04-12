import Form from "../../components/form/Form";

export default function Signup() {
  return (
    <div className="select-none bg-slate-200 w-[100%] h-[100vh] flex justify-center items-center">
      <Form forLogin={false} />
    </div>
  );
}
