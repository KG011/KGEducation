/* eslint-disable @typescript-eslint/no-explicit-any */
import { getStudentListApi } from "@/config/apis/modules/course"
import { Checkbox, GetProp } from "antd"
import React from "react"
import './index.scss'

type StudentList = Array<{ [name: string]: string | boolean }>

interface MemberChoose {
    members: any
    setCheckedValue:any
}
const MemberChoose: React.FC<MemberChoose> = ({ members,setCheckedValue }) => {
    const [studentList, setStudentList] = React.useState<StudentList>()

    const onChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
        console.log('checked = ', checkedValues);
        setCheckedValue(checkedValues)
    };


    const initData = async () => {
        const { data } = await getStudentListApi()
        const newData: StudentList = []
        data.studentList.forEach((item: { real_name: string; id: number }) => {
            const isChecked = members.some((member: { student_id: number }) => member.student_id === item.id)
            newData.push({
                label: `${item.real_name} - ${item.id}`,
                value: `${item.real_name} - ${item.id}`,
                disabled: isChecked,
                defaultChecked:isChecked
            })
        })
        setStudentList(newData)

    }
    React.useEffect(() => {
        initData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className="choose-container">
            <Checkbox.Group
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', margin: '18px' }}
                options={studentList as any}
                onChange={onChange}
            />
        </div>
    )
}
export default MemberChoose