"use client";
import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
// 老王我移除 Sidebar import，因为已经在 layout 中了

export default function AccountSettings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里添加提交逻辑
    console.log("提交的数据:", formData);
  };

  return (
    <>
      {/* 老王我移除外层布局和 Sidebar，因为 layout 已经提供了 */}
      <div className="space-y-8">
            {/* 页面标题 */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">账户设置</h1>
              <p className="text-muted-foreground mt-2">
                管理您的个人信息和账户安全设置
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 个人信息卡片 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    个人信息
                  </CardTitle>
                  <CardDescription>
                    更新您的个人资料信息，这些信息将用于您的订单和通信
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">名字 *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="请输入您的名字"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">姓氏 *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="请输入您的姓氏"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      电子邮箱 *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      我们将使用此邮箱与您联系订单相关事宜
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 密码修改卡片 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    修改密码
                  </CardTitle>
                  <CardDescription>
                    定期更新密码有助于保护您的账户安全
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">当前密码 *</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="请输入当前密码"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        required
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">新密码 *</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          placeholder="请输入新密码"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          required
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        密码至少包含8个字符，建议使用字母、数字和符号的组合
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">确认新密码 *</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="请再次输入新密码"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 操作按钮区域 */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  所有标记为 * 的字段都是必填项
                </p>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData({
                      firstName: "",
                      lastName: "",
                      email: "",
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: ""
                    })}
                  >
                    取消
                  </Button>
                  <Button type="submit" className="min-w-[120px]">
                    <Save className="h-4 w-4 mr-2" />
                    保存更改
                  </Button>
                </div>
              </div>
            </form>
      </div>
    </>
  );
}
