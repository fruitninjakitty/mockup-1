
import { OrganizationSearch } from "@/components/common/FormFields/OrganizationSearch";
import { SchoolCodeField as CommonSchoolCodeField } from "@/components/common/FormFields/SchoolCodeField";

interface SchoolCodeFieldProps {
  schoolCode: string;
  onSchoolCodeChange: (value: string) => void;
}

export function SchoolCodeField({ schoolCode, onSchoolCodeChange }: SchoolCodeFieldProps) {
  return (
    <CommonSchoolCodeField
      schoolCode={schoolCode}
      onSchoolCodeChange={onSchoolCodeChange}
    />
  );
}
