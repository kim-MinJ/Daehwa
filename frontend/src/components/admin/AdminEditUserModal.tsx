// src/components/admin/AdminEditUserModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { User } from './types';

interface AdminEditUserModalProps {
  editingUser: User | null;
  setEditingUser: (user: User | null) => void;
  updateUserStatus: (id: string, status: 'active' | 'inactive' | 'banned') => void;
}

export default function AdminEditUserModal({ editingUser, setEditingUser, updateUserStatus }: AdminEditUserModalProps) {
  if (!editingUser) return null;

  return (
    <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>회원 정보 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>상태 변경</Label>
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant={editingUser.status === 'active' ? 'default' : 'outline'}
                onClick={() => updateUserStatus(editingUser.id, 'active')}
              >
                활성
              </Button>
              <Button
                size="sm"
                variant={editingUser.status === 'inactive' ? 'default' : 'outline'}
                onClick={() => updateUserStatus(editingUser.id, 'inactive')}
              >
                비활성
              </Button>
              <Button
                size="sm"
                variant={editingUser.status === 'banned' ? 'destructive' : 'outline'}
                onClick={() => updateUserStatus(editingUser.id, 'banned')}
              >
                차단
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
