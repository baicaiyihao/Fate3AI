import { useState } from 'react';

const MyForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [response, setResponse] = useState('');

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault(); // 阻止默认提交行为
    const formDataToSend = new FormData();
    formDataToSend.append('user', formData.name);//agent角色名称
    formDataToSend.append('text',  "塔罗牌：The Fool"+formData.message);
    formDataToSend.append('action',"REPLY")

    try {
      const response = await fetch('http://34.130.171.194:3000/44796f3c-9b73-077b-b789-df5b0db6896e/message', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'application/json',
          'Accept-Language': 'zh-CN,zh;q=0.9',
        },
      });

      const data = await response.text(); // 获取响应数据
      console.log("response data：",data)

      setResponse(`响应状态: ${response.status}\n响应数据: ${data.replace(/\n/g, '\n    ')}`); // 显示响应
    } catch (error) {
      setResponse(`错误: ${(error as Error).message}`); // 显示错误信息
    }
  };

  return (
    <div>
      <form id="myForm" onSubmit={handleSubmit}>
        <label htmlFor="name">姓名:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <br />
       
        <br />
        <label htmlFor="message">消息:</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">提交</button>
      </form>

      <div id="response">
        {response && <pre>{response}</pre>} {/* 显示响应 */}
      </div>
    </div>
  );
};

export default MyForm;