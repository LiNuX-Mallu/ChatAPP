import Form from "../../components/form/Form";

export default function Login() {
  return (
    <div className="select-none bg-slate-200 w-[100%] h-[100vh] flex justify-center items-center">
      <Form forLogin={true} />
    </div>
  );
}
